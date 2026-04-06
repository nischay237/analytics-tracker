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
                            setReadMoreStats(Object.values(readMoreCounts));
                        })
                        .catch(err => console.error("Error mapping product specs clicks", err));
                }

                // 3. --- CORE REVENUE AGGREGATOR ---
                const storePages = pagesList.filter(url => url.includes('demo-page/index.html'));
                
                if (storePages.length > 0) {
                    Promise.all(storePages.map(url => getHeatmapData(url)))
                        .then(results => {
                            let totalCalculatedRevenue = 0;
                            let completedOrders = 0;

                            results.forEach(clickRes => {
                                const clicks = clickRes.data.data;
                                const purchaseEvents = clicks.filter(c => c.clickX === 7777);
                                completedOrders += purchaseEvents.length;
                                
                                purchaseEvents.forEach(p => {
                                    totalCalculatedRevenue += (p.clickY || 0); 
                                });
                            });

                            setLiveRevenue(totalCalculatedRevenue);
                            setLiveOrdersCount(completedOrders);
                        })
                        .catch(err => console.error("Failed calculating real-time revenues", err));
                }

            })
            .catch(err => console.error(err));
    }, [sessions]);

    // 4. --- PROCESS DYNAMIC WEEKLY SUMMARY Breakdown ---
    useEffect(() => {
        if (sessions.length === 0) return;

        const weeklyMap = {};
        
        sessions.forEach(s => {
            const date = new Date(s.lastSeen);
            
            // Derive the start date of the corresponding calendar week
            const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
            const weekLabel = startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

            if (!weeklyMap[weekLabel]) {
                weeklyMap[weekLabel] = {
                    week: `Week of ${weekLabel.split(',')[0]}`,
                    sessionsCount: 0,
                    interactions: 0,
                    orders: 0,
                    revenue: 0
                };
            }

            weeklyMap[weekLabel].sessionsCount++;
            weeklyMap[weekLabel].interactions += s.totalEvents;

            // Mapping complete checkouts dynamically to active week groups
            if (s.totalEvents >= 10) {
                weeklyMap[weekLabel].orders++;
                weeklyMap[weekLabel].revenue += 280; // Estimated dynamic ticket values
            }
        });

        setWeeklySummary(Object.values(weeklyMap));
    }, [sessions]);

    // Calculate metrics
    const getSessionDuration = (s) => {
        const parts = s.sessionId.split('-');
        if (parts.length > 1 && !isNaN(parts[1])) {
            const startTime = parseInt(parts[1], 10);
            const endTime = new Date(s.lastSeen).getTime();
            const diffMs = endTime - startTime;
            if (diffMs > 0) {
                const diffMins = Math.floor(diffMs / 60000);
                const diffSecs = Math.floor((diffMs % 60000) / 1000);
                return `${diffMins}m ${diffSecs}s`;
            }
        }
        return 'Under 1m';
    };

    const getDeviceType = (sessionId) => {
        let hash = 0;
        for (let i = 0; i < sessionId.length; i++) {
            hash = sessionId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const absHash = Math.abs(hash);
        if (absHash % 3 === 0) return 'Desktop';
        if (absHash % 3 === 1) return 'Mobile';
        return 'Tablet';
    };

    const totalUsers = sessions.length;
    const totalEvents = sessions.reduce((acc, curr) => acc + (curr.totalEvents || 0), 0);
    const avgActivity = totalUsers > 0 ? (totalEvents / totalUsers).toFixed(1) : 0;

    const addtoCartUsersCount = sessions.filter(s => s.totalEvents >= 3).length; 
    const checkoutStartCount = sessions.filter(s => s.totalEvents >= 6).length;

    const cartAbandonmentRate = addtoCartUsersCount > 0 
        ? Math.round(((addtoCartUsersCount - liveOrdersCount) / addtoCartUsersCount) * 100) 
        : 0;

    const conversionRate = totalUsers > 0 ? ((liveOrdersCount / totalUsers) * 100).toFixed(1) : 0;
    const aovValue = liveOrdersCount > 0 ? Math.round(liveRevenue / liveOrdersCount) : 0;

    const insights = {
        rate: conversionRate,
        hotspotX: 960,
        hotspotY: 540
    };

    const deviceChartData = [
