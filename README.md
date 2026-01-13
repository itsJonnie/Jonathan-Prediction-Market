# Jonathan's Prediction Market

A modern, full-featured prediction market platform inspired by [Kalshi](https://kalshi.com) and [Polymarket](https://polymarket.com). This project was born from a fascination with how prediction markets aggregate collective intelligence and provide a unique way to bet on future events across sports, technology, entertainment, and more.

## 🎯 Inspiration

The journey began with discovering **Kalshi** and **Polymarket** - two groundbreaking platforms that democratized prediction markets. Kalshi's regulatory-first approach and Polymarket's decentralized model showed me the power of combining financial markets with information aggregation. This project is my exploration of building a prediction market that captures the excitement and utility of these platforms.

## ✨ Core Features

### 🏠 Market Discovery
- **Live Market Feed**: Real-time updates of all active markets with live price indicators
- **Featured Markets**: Highlighted markets with trending indicators
- **Advanced Search**: Search markets by title, description, or category
- **Category Filtering**: Browse markets by category (Sports, Technology, Entertainment, etc.)

### 📊 Market Trading
- **Order Book**: View buy/sell orders with depth visualization
- **Trading Panel**: Intuitive interface for buying YES/NO shares
- **Live Price Updates**: Real-time probability updates every 3 seconds
- **Market Detail Pages**: Comprehensive view with charts, activity feed, and trading interface

### 🤖 AI-Powered Trading Bot
- **Multiple Strategies**: Choose from Value Trading, Momentum Trading, Contrarian Strategy, or Balanced Approach
- **Bot Configuration**: Customize risk levels, trading frequency, and strategy parameters
- **Activity Feed**: Monitor bot trades and decisions in real-time
- **Performance Stats**: Track bot profitability and win rates

### 📈 Portfolio Management
- **Position Tracking**: View all your active positions across markets
- **Profit/Loss Analysis**: Real-time P&L calculations
- **Position Cards**: Detailed view of each market position with current value

### 🏆 Leaderboard
- **Top Traders**: Ranked leaderboard of most successful traders
- **Performance Metrics**: Track volume, win rate, and total profit

### 🎨 Market Creation
- **AI Suggestions**: Get AI-powered market suggestions based on trending topics
- **Step-by-Step Wizard**: Guided 3-step process for creating markets
- **Media Upload**: Add images and media to make markets more engaging
- **Resolution Criteria**: Define clear rules for how markets resolve

### 🎭 User Experience
- **Dark Mode**: Beautiful dark theme optimized for extended trading sessions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Toast Notifications**: Real-time feedback for all actions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **Vite 6** - Lightning-fast build tool and dev server
- **React Router 7** - Client-side routing for SPA navigation
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library built on Radix UI

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful data synchronization and caching
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Backend Integration
- **Base44 SDK** - Backend-as-a-Service for market data, authentication, and real-time updates
- **RESTful API** - Clean API integration for market operations

### UI Components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library for data visualization
- **Sonner** - Toast notification system

### Development Tools
- **ESLint** - Code linting and quality checks
- **TypeScript** - Type safety (partial implementation)
- **PostCSS** - CSS processing with Autoprefixer

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/itsJonnie/Jonathan-Prediction-Market.git
cd Jonathan-Prediction-Market
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (if needed):
```bash
# The Base44 app ID is configured in src/api/base44Client.js
# Update it with your own Base44 app ID if needed
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment & Domain Setup

### Domain Purchase on NameCheap

I purchased my custom domain through [NameCheap](https://www.namecheap.com/), a popular and reliable domain registrar. Here's the process I followed:

1. **Search for Available Domains**: Used NameCheap's domain search to find an available domain name that matched my project
2. **Select Domain**: Chose a domain that was memorable and relevant to the prediction market theme
3. **Complete Purchase**: Added the domain to cart and completed the purchase (NameCheap offers competitive pricing and often includes free privacy protection for the first year)
4. **Domain Management**: Accessed the NameCheap dashboard to manage DNS settings and configure domain records

### Hosting Setup

After building the production version of the app, I deployed it to a hosting provider. The deployment process typically involves:

1. **Build the Application**:
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist` directory.

2. **Deploy to Hosting Provider**: 
   - Uploaded the `dist` folder contents to the hosting provider's server
   - Configured the server to serve the static files correctly
   - Set up proper routing for the React Router SPA (ensuring all routes serve `index.html`)

3. **Configure DNS on NameCheap**:
   - Logged into NameCheap account
   - Navigated to Domain List → Manage → Advanced DNS
   - Added/updated DNS records:
     - **A Record**: Pointed the domain to the hosting provider's IP address
     - **CNAME Record** (if using subdomain): Pointed www subdomain to the main domain
   - Waited for DNS propagation (typically 24-48 hours, but often faster)

4. **SSL Certificate**: 
   - Most modern hosting providers offer free SSL certificates (Let's Encrypt)
   - Configured HTTPS to ensure secure connections

### Hosting Considerations

For a Vite + React application like this:
- **Static Hosting**: Works great with static hosting providers (Vercel, Netlify, GitHub Pages, etc.)
- **Server Configuration**: Ensure the server is configured to serve `index.html` for all routes (SPA routing)
- **Environment Variables**: If using environment variables, configure them in the hosting provider's dashboard
- **Base44 API**: Ensure the Base44 app ID and any API keys are properly configured for production

The combination of NameCheap for domain management and a modern hosting provider makes it easy to get a professional, production-ready prediction market platform live on the web!

## 📁 Project Structure

```
src/
├── api/              # Base44 SDK client and API integrations
├── components/       # React components
│   ├── bot/         # Trading bot components
│   ├── markets/     # Market-related components
│   ├── portfolio/   # Portfolio components
│   └── ui/          # Reusable UI components (shadcn/ui)
├── pages/           # Page components (Home, CreateMarket, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── utils/           # Helper utilities
```

## 🎯 Key Features Explained

### Real-Time Market Updates
Markets update every 3 seconds using React Query's `refetchInterval`, ensuring traders always see the latest prices and probabilities.

### AI Market Suggestions
The market creation flow includes AI-powered suggestions to help users discover trending topics and create engaging markets.

### Trading Bot Strategies
Four distinct trading strategies allow users to automate their trading:
- **Value Trading**: Find undervalued markets
- **Momentum Trading**: Follow trends and ride movements
- **Contrarian Strategy**: Bet against market consensus
- **Balanced Approach**: Diversified, risk-controlled strategy

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- **Kalshi** - For inspiring the regulatory-first approach to prediction markets
- **Polymarket** - For demonstrating the power of decentralized prediction markets
- **Base44** - For providing the backend infrastructure
- **shadcn** - For the beautiful component library
- **Vite Team** - For the incredible build tool

---

Built with ❤️ by Jonathan
