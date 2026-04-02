import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessions, getAllPages, getHeatmapData } from '../services/api';
import { 
    Users, 
    Zap, 
    Activity, 
    ArrowRight, 
    Clock, 
    Target, 
    MousePointerClick, 
    Monitor, 
    Cpu, 
    Sparkles,
    Calendar,
    BookOpen,
    Search,
    DollarSign,
    ShoppingCart,
    Percent
} from 'lucide-react';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';

function Dashboard() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readMoreStats, setReadMoreStats] = useState([]);
    const [searchedKeywords, setSearchKeywords] = useState([]);
    
    // Core Full-Stack Financial States
    const [liveRevenue, setLiveRevenue] = useState(0);
    const [liveOrdersCount, setLiveOrdersCount] = useState(0);
    const [weeklySummary, setWeeklySummary] = useState([]);

    useEffect(() => {
        getSessions()
            .then(res => setSessions(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // FETCH HEATMAP & EVENTS DATA TO CONFIGURE READ MORE, SEARCH, REAL REVENUES & WEEKLY BREAKDOWN
    useEffect(() => {
        getAllPages()
            .then(res => {
                const pagesList = res.data.data;
                
                // 1. PROCESS DYNAMIC KEYWORDS FROM INTERNAL SITE SEARCH
                const searchUrls = pagesList.filter(url => url.includes('?search='));
                const keywordMap = {};

                searchUrls.forEach(url => {
                    try {
                        const query = decodeURIComponent(url.split('?search=')[1]);
                        if (query && query.trim() !== '') {
                            const cleanedQuery = query.trim().toLowerCase();
                            keywordMap[cleanedQuery] = (keywordMap[cleanedQuery] || 0) + 1;
                        }
                    } catch (e) {
                        console.error("Failed to parse keyword", e);
                    }
                });

                const sortedKeywords = Object.entries(keywordMap).map(([text, count]) => ({
                    text: text,
                    count: count
                })).sort((a, b) => b.count - a.count);

                setSearchKeywords(sortedKeywords);


                // 2. PROCESS READ BLUEPRINTS MAPPED CLICKS
                const readMoreCounts = {
                    1: { name: "Apex ANC Headphones", count: 0, icon: "🎧" },
                    2: { name: "Horizon Smart Watch", count: 0, icon: "⌚" },
                    3: { name: "Tactile Keyboard 75%", count: 0, icon: "⌨️" },
                    4: { name: "Precision Gaming Mouse", count: 0, icon: "🖱️" },
                    5: { name: "Ultrawide Curved Monitor", count: 0, icon: "🖥️" },
                    6: { name: "Neural VR Headset", count: 0, icon: "🥽" }
                };

                const hashedPages = pagesList.filter(url => url.includes('#product-'));

                if (hashedPages.length === 0) {
                    setReadMoreStats(Object.values(readMoreCounts));
                } else {
                    Promise.all(hashedPages.map(url => getHeatmapData(url)))
                        .then(results => {
                            results.forEach((clickRes, idx) => {
                                const clicks = clickRes.data.data;
                                const url = hashedPages[idx];
                                
                                const parts = url.split('#product-');
                                if (parts.length > 1) {
                                    const productId = parseInt(parts[1], 10);
                                    if (productId && readMoreCounts[productId]) {
                                        clicks.forEach(c => {
                                            if (c.clickY >= 400 && c.clickY <= 850) {
                                                readMoreCounts[productId].count++;
                                            }
                                        });
                                    }
                                }
                            });
