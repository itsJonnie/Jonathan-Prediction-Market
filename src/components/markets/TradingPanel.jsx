import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderBook from './OrderBook';

// Order matching logic
const matchOrders = async (newOrder, market) => {
  // Get all open orders for this market and side
  const oppositeAction = newOrder.action === 'buy' ? 'sell' : 'buy';
  const existingOrders = await base44.entities.Order.filter({
    market_id: market.id,
    side: newOrder.side,
    action: oppositeAction,
    status: 'open'
  });

  // Sort orders by price (best first)
  const sortedOrders = newOrder.action === 'buy'
    ? existingOrders.sort((a, b) => a.price - b.price) // Buy wants lowest ask
    : existingOrders.sort((a, b) => b.price - a.price); // Sell wants highest bid

  let remainingQuantity = newOrder.quantity;
  const trades = [];
  const ordersToUpdate = [];

  for (const existingOrder of sortedOrders) {
    if (remainingQuantity <= 0) break;

    // Check if prices match
    const pricesMatch = newOrder.action === 'buy' 
      ? newOrder.price >= existingOrder.price
      : newOrder.price <= existingOrder.price;

    if (!pricesMatch && newOrder.order_type === 'limit') break;

    // Calculate fill quantity
    const availableQuantity = existingOrder.quantity - existingOrder.filled_quantity;
    const fillQuantity = Math.min(remainingQuantity, availableQuantity);
    const executionPrice = existingOrder.price; // Price taker pays maker's price

    // Create trade record
    trades.push({
      market_id: market.id,
      market_title: market.title,
      side: newOrder.side,
      action: newOrder.action,
      shares: fillQuantity,
      price: executionPrice,
      total: (fillQuantity * executionPrice) / 100
    });

    // Update existing order
    const newFilledQty = existingOrder.filled_quantity + fillQuantity;
    ordersToUpdate.push({
      id: existingOrder.id,
      filled_quantity: newFilledQty,
      status: newFilledQty >= existingOrder.quantity ? 'filled' : 'partial'
    });

    remainingQuantity -= fillQuantity;
  }

  return { trades, ordersToUpdate, remainingQuantity };
};

export default function TradingPanel({ market }) {
  const [side, setSide] = useState('yes');
  const [orderType, setOrderType] = useState('limit');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const queryClient = useQueryClient();

  // Get best bid/ask for market orders with live updates
  const { data: buyOrders = [] } = useQuery({
    queryKey: ['buy-orders', market.id, side],
    queryFn: () => base44.entities.Order.filter({
      market_id: market.id,
      side: side,
      action: 'buy',
      status: 'open'
    }),
    refetchInterval: 1000, // Live order book updates
  });

  const { data: sellOrders = [] } = useQuery({
    queryKey: ['sell-orders', market.id, side],
    queryFn: () => base44.entities.Order.filter({
      market_id: market.id,
      side: side,
      action: 'sell',
      status: 'open'
    }),
    refetchInterval: 1000, // Live order book updates
  });

  const bestBid = Math.max(...buyOrders.map(o => o.price), 0);
  const bestAsk = Math.min(...sellOrders.map(o => o.price), 100);

  const placeOrderMutation = useMutation({
    mutationFn: async ({ side, orderType, action, price, quantity }) => {
      const orderPrice = orderType === 'market' 
        ? (action === 'buy' ? bestAsk : bestBid)
        : parseFloat(price);

      // Create the order
      const newOrder = {
        market_id: market.id,
        market_title: market.title,
        side,
        order_type: orderType,
        action,
        price: orderPrice,
        quantity: parseFloat(quantity),
        filled_quantity: 0,
        status: 'open'
      };

      // Try to match orders
      const { trades, ordersToUpdate, remainingQuantity } = await matchOrders(newOrder, market);

      // Execute all trades
      for (const trade of trades) {
        await base44.entities.Trade.create(trade);
        
        // Update or create position
        const userPositions = await base44.entities.Position.filter({
          market_id: market.id,
          side: trade.side,
          created_by: (await base44.auth.me()).email
        });

        if (userPositions.length > 0) {
          const position = userPositions[0];
          const newShares = position.shares + (trade.action === 'buy' ? trade.shares : -trade.shares);
          const newAvgPrice = trade.action === 'buy'
            ? ((position.shares * position.avg_price) + (trade.shares * trade.price)) / newShares
            : position.avg_price;

          await base44.entities.Position.update(position.id, {
            shares: newShares,
            avg_price: newAvgPrice,
            current_value: newShares * trade.price / 100
          });
        } else if (trade.action === 'buy') {
          await base44.entities.Position.create({
            market_id: market.id,
            market_title: market.title,
            side: trade.side,
            shares: trade.shares,
            avg_price: trade.price,
            current_value: trade.shares * trade.price / 100
          });
        }
      }

      // Update matched orders
      for (const orderUpdate of ordersToUpdate) {
        await base44.entities.Order.update(orderUpdate.id, {
          filled_quantity: orderUpdate.filled_quantity,
          status: orderUpdate.status
        });
      }

      // Create order for remaining quantity
      if (remainingQuantity > 0) {
        await base44.entities.Order.create({
          ...newOrder,
          quantity: remainingQuantity,
          filled_quantity: 0,
          status: 'open'
        });
      }

      // Update market volume
      const totalTraded = trades.reduce((sum, t) => sum + t.total, 0);
      await base44.entities.Market.update(market.id, {
        volume: (market.volume || 0) + totalTraded
      });

      return { trades, remainingQuantity };
    },
    onSuccess: ({ trades, remainingQuantity }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      
      if (trades.length > 0) {
        toast.success(`${trades.length} order(s) matched! ${remainingQuantity > 0 ? `${remainingQuantity.toFixed(2)} shares remain as open order.` : ''}`);
      } else {
        toast.success('Order placed in the book!');
      }
      
      setPrice('');
      setQuantity('');
    },
    onError: (error) => {
      toast.error('Failed to place order');
      console.error(error);
    },
  });

  const handlePlaceOrder = (action) => {
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (orderType === 'limit' && (!price || parseFloat(price) <= 0 || parseFloat(price) > 100)) {
      toast.error('Please enter a valid price (0-100)');
      return;
    }

    placeOrderMutation.mutate({ side, orderType, action, price, quantity });
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-zinc-800/50">
          <TabsTrigger value="trade">Place Order</TabsTrigger>
          <TabsTrigger value="book">Order Book</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="p-5 space-y-4">
          {/* Side Selection */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Outcome</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={side === 'yes' ? 'default' : 'outline'}
                onClick={() => setSide('yes')}
                className={side === 'yes' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Yes
              </Button>
              <Button
                variant={side === 'no' ? 'default' : 'outline'}
                onClick={() => setSide('no')}
                className={side === 'no' 
                  ? 'bg-rose-600 hover:bg-rose-700' 
                  : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Order Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderType === 'limit' ? 'default' : 'outline'}
                onClick={() => setOrderType('limit')}
                className={orderType === 'limit' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }
              >
                Limit
              </Button>
              <Button
                variant={orderType === 'market' ? 'default' : 'outline'}
                onClick={() => setOrderType('market')}
                className={orderType === 'market' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }
              >
                Market
              </Button>
            </div>
          </div>

          {/* Price Input (for limit orders) */}
          {orderType === 'limit' && (
            <div>
              <Label htmlFor="price" className="text-zinc-400 text-xs mb-2 block">
                Price (¢)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50.0"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          )}

          {/* Market Price Display */}
          {orderType === 'market' && (
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-zinc-500 mb-1">Best Available Price:</p>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Buy at: <span className="text-rose-400 font-bold">{bestAsk}¢</span></span>
                <span className="text-sm text-zinc-400">Sell at: <span className="text-emerald-400 font-bold">{bestBid}¢</span></span>
              </div>
            </div>
          )}

          {/* Quantity Input */}
          <div>
            <Label htmlFor="quantity" className="text-zinc-400 text-xs mb-2 block">
              Quantity (shares)
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="100"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Order Summary */}
          {quantity && (orderType === 'market' || price) && (
            <div className="bg-zinc-800/50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shares:</span>
                <span className="text-white font-medium">{parseFloat(quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Est. Total:</span>
                <span className="text-white font-medium">
                  ${((parseFloat(quantity) * (orderType === 'market' ? bestAsk : parseFloat(price || 0))) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => handlePlaceOrder('buy')}
              disabled={placeOrderMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {placeOrderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Buy'
              )}
            </Button>
            <Button
              onClick={() => handlePlaceOrder('sell')}
              disabled={placeOrderMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {placeOrderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sell'
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="book" className="p-5">
          <OrderBook marketId={market.id} side={side} />
        </TabsContent>
      </Tabs>
    </div>
  );
}