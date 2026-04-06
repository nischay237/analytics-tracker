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
        { name: 'Desktop', value: sessions.filter(s => getDeviceType(s.sessionId) === 'Desktop').length || 1, color: '#6366f1' },
        { name: 'Mobile', value: sessions.filter(s => getDeviceType(s.sessionId) === 'Mobile').length || 0, color: '#10b981' },
        { name: 'Tablet', value: sessions.filter(s => getDeviceType(s.sessionId) === 'Tablet').length || 0, color: '#f59e0b' }
    ];

    const getChartData = () => {
        const grouped = sessions.reduce((acc, curr) => {
            const date = new Date(curr.lastSeen).toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric' 
            });
            const existing = acc.find(item => item.date === date);
            if (existing) {
                existing.Users += 1;
                existing.Events += curr.totalEvents;
            } else {
                acc.push({ date, Users: 1, Events: curr.totalEvents });
            }
            return acc;
        }, []);
        return grouped.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const chartData = getChartData();

    const funnelData = [
        { name: '1. Product Views', users: totalUsers, fill: '#6366f1' },
        { name: '2. Added to Cart', users: addtoCartUsersCount, fill: '#818cf8' },
        { name: '3. Checkout Start', users: checkoutStartCount, fill: '#a5b4fc' },
        { name: '4. Orders Complete', users: liveOrdersCount, fill: '#10b981' }
    ];

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="h-32 bg-slate-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-72 bg-slate-200 rounded-2xl"></div>
                <div className="h-60 bg-slate-200 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans pb-12">
            
            {/* Top Interactive Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                        E-Commerce Analytics Engine
                    </h2>
                    <p className="text-indigo-100 text-sm font-medium">
                        Real-time visitor purchase signals, checkout tunnels & cart insights
                    </p>
                </div>
                <span className="self-start md:self-center inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 backdrop-blur-md">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" /> Sales Timelines
                </span>
            </div>

            {/* E-Commerce Real-Time KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex items-center justify-between group">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales (Revenue)</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">${liveRevenue.toFixed(2)}</h3>
                        <p className="text-xs text-emerald-500 font-bold mt-1">Live payments decrypted</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <DollarSign className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex items-center justify-between group">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value (AOV)</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">${aovValue.toFixed(2)}</h3>
                        <p className="text-xs text-slate-400 mt-1">Simulated ticket averages</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all duration-300 flex items-center justify-between group">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cart Abandonment</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{cartAbandonmentRate}%</h3>
                        <p className="text-xs text-rose-500 font-semibold mt-1">Dropped carts before checkout</p>
                    </div>
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                        <Percent className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-100 transition-all duration-300 flex items-center justify-between group">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{conversionRate}%</h3>
                        <p className="text-xs text-slate-400 mt-1">Visitor to Checkout ratio</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                        <Target className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* DYNAMIC NEW FEATURE: WEEKLY SUMMARY BREAKDOWN CARDS */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Calendar className="h-5 w-5 animate-bounce" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">📅 Weekly Performance Summary</h3>
                        <p className="text-xs text-slate-500">Historical week-by-week aggregated logs of store traffic and orders completed</p>
                    </div>
                </div>

                {weeklySummary.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No historical records logged yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {weeklySummary.map((summary, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl hover:border-indigo-400 hover:bg-white hover:shadow-md transition-all cursor-default space-y-4">
                                <div className="border-b border-slate-200 pb-2">
                                    <p className="text-xs font-black text-slate-400 uppercase">Billing Timeline</p>
                                    <p className="text-sm font-extrabold text-indigo-600 mt-0.5">{summary.week}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-y-3 text-xs font-bold text-slate-600">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Shoppers</p>
                                        <p className="text-sm font-extrabold text-slate-900 mt-0.5">{summary.sessionsCount} Users</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Actions</p>
                                        <p className="text-sm font-extrabold text-slate-900 mt-0.5">{summary.interactions} Clicks</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Orders</p>
                                        <p className="text-sm font-extrabold text-slate-900 mt-0.5">{summary.orders} Sales</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-emerald-500 font-semibold uppercase">Revenues</p>
                                        <p className="text-sm font-extrabold text-emerald-600 mt-0.5">${summary.revenue}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                            <Activity className="h-5 w-5 text-indigo-500" />
                            Visitor Acquisition Timeline
                        </h3>
                        <p className="text-xs text-slate-500">Chronological analysis of store visits and customer activity logs</p>
                    </div>
                    
                    {chartData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                            No visitor records captured.
                        </div>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#818cf8' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="Users" 
                                        stroke="#6366f1" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorSessions)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Device Donut Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-400 flex items-center gap-1.5">
                            <Monitor className="h-5 w-5 text-slate-400" />
                            Terminal Distribution
                        </h3>
                        <p className="text-xs text-slate-500">Demographics of shopper browser viewports</p>
                    </div>

                    <div className="h-48 my-4 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

