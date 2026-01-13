import Layout from "./Layout.jsx";

import CreateMarket from "./CreateMarket";

import Home from "./Home";

import Leaderboard from "./Leaderboard";

import MarketDetail from "./MarketDetail";

import Portfolio from "./Portfolio";

import TradingBot from "./TradingBot";

import About from "./About";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    CreateMarket: CreateMarket,
    
    Home: Home,
    
    Leaderboard: Leaderboard,
    
    MarketDetail: MarketDetail,
    
    Portfolio: Portfolio,
    
    TradingBot: TradingBot,
    
    About: About,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<CreateMarket />} />
                
                
                <Route path="/CreateMarket" element={<CreateMarket />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Leaderboard" element={<Leaderboard />} />
                
                <Route path="/MarketDetail" element={<MarketDetail />} />
                
                <Route path="/Portfolio" element={<Portfolio />} />
                
                <Route path="/TradingBot" element={<TradingBot />} />
                
                <Route path="/About" element={<About />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}