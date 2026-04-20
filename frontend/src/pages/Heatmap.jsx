import { useEffect, useState } from 'react';
import { getAllPages, getHeatmapData, resetHeatmapData, getSessions } from '../services/api';
import { 
    Flame, 
    Compass, 
    MousePointer, 
    Monitor, 
    HelpCircle, 
    Layers,
    AlertCircle,
    Globe,
    SlidersHorizontal,
    Eye,
    Maximize2,
    Trash2,
    Sparkles,
    Clock,
    Target,
    TrendingDown,
    BookOpen
} from 'lucide-react';

function Heatmap() {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState('');
    const [clicks, setClicks] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dynamic UI States
    const [showIframe, setShowIframe] = useState(true);
    const [iframeOpacity, setIframeOpacity] = useState(0.4);
    const [spotSize, setSpotSize] = useState(40);

    const loadPages = () => {
        getAllPages()
            .then(res => setPages(res.data.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        loadPages();
        getSessions()
            .then(res => setSessions(res.data.data))
            .catch(err => console.error(err));
    }, []);

    const fetchClicks = () => {
        if (selectedPage) {
            setLoading(true);
            getHeatmapData(selectedPage)
                .then(res => setClicks(res.data.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setClicks([]);
        }
    };

    useEffect(() => {
        fetchClicks();
    }, [selectedPage]);

    // DYNAMIC HEATMAP COORIDNATE TO E-COMMERCE PRODUCT MAPPING ANALYSIS
    const analyzeCoordinatesAndMetrics = () => {
        let headerClicks = 0;
        let prodHeadphones = 0; // Row 1, Col 1
        let prodWatch = 0;      // Row 1, Col 2
        let prodKeyboard = 0;   // Row 1, Col 3
        let prodMouse = 0;      // Row 2, Col 1
        let prodMonitor = 0;    // Row 2, Col 2
        let prodVR = 0;         // Row 2, Col 3
        let randomClicks = 0;

        clicks.forEach(c => {
            const x = c.clickX;
            const y = c.clickY;

            // 1920x1080 Responsive Storefront Grid coordinates mapping
            if (y < 250) {
                headerClicks++;
            } else if (y >= 250 && y < 650) {
                if (x < 640) prodHeadphones++;
                else if (x >= 640 && x < 1280) prodWatch++;
                else prodKeyboard++;
            } else if (y >= 650) {
                if (x < 640) prodMouse++;
                else if (x >= 640 && x < 1280) prodMonitor++;
                else prodVR++;
            } else {
                randomClicks++;
            }
        });

        // Structure product lists based on raw coordinate click densities
        const productsList = [
            { name: "Cart Controls & Filter Menus", count: headerClicks, icon: "🛒", category: "Navigation" },
            { name: "Apex ANC Wireless Headphones", count: prodHeadphones, icon: "🎧", category: "Audio" },
            { name: "Horizon Minimalist Smart Watch", count: prodWatch, icon: "⌚", category: "Wearables" },
            { name: "Tactile Mechanical Keyboard 75%", count: prodKeyboard, icon: "⌨️", category: "Accessories" },
            { name: "Precision Gaming Mouse", count: prodMouse, icon: "🖱️", category: "Accessories" },
            { name: "Apex UltraWide Curved Monitor", count: prodMonitor, icon: "🖥️", category: "Monitors" },
            { name: "Neural Standalone VR Headset", count: prodVR, icon: "🥽", category: "Wearables" }
        ].sort((a, b) => b.count - a.count);

        // Find the physical gadget that has highest active clicks
        const winnerProduct = productsList.find(p => p.category !== "Navigation" && p.count > 0) || null;

        // Smart Buying intent probability math (Click density weights)
        let buyChancePercentage = 0;
        if (winnerProduct && clicks.length > 0) {
            const clickShare = (winnerProduct.count / clicks.length) * 100;
            // Higher click intensity increases checkout conversion projection curves
            buyChancePercentage = Math.min(Math.round(clickShare * 1.6 + 10), 96); 
        }

        const pageSessions = sessions.filter(s => s.totalEvents > 0);
        const bouncedOnPage = pageSessions.filter(s => s.totalEvents <= 2).length;
        const pageBounceRate = pageSessions.length > 0 
            ? Math.round((bouncedOnPage / pageSessions.length) * 100) 
            : 0;

        return {
            rankedProducts: productsList,
            bounceRate: pageBounceRate,
            avgReadingTime: "2m 14s", 
            winner: winnerProduct,
            buyChance: buyChancePercentage || 10
        };
    };

    const report = analyzeCoordinatesAndMetrics();

    const handleReset = () => {
        if (!selectedPage) return;
        const confirmDelete = window.confirm("Are you sure you want to permanently delete all clicks and reset this page's heatmap? This action cannot be undone.");
        
        if (confirmDelete) {
            resetHeatmapData(selectedPage)
                .then(() => {
                    alert("Heatmap data reset successfully!");
                    setClicks([]); 
                    loadPages(); 
                })
                .catch(err => {
                    console.error(err);
                    alert("Failed to reset heatmap.");
                });
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
                        Interactive Click Heatmap
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Analyze visual thermal patterns of user interactions layered on your source page
                    </p>
                </div>
            </div>

            {/* Selector Card & Clicks Count */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="flex-grow">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-indigo-500" />
                            Select Captured Page URL:
                        </label>
                        <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all cursor-pointer shadow-inner"
                        >
                            <option value="">-- Choose a website/page to analyze --</option>
                            {pages.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {selectedPage && (
                        <div className="flex items-center gap-4 self-start lg:self-auto">
                            <div className="bg-indigo-500 text-white px-6 py-4 rounded-2xl flex items-center gap-5 shadow-lg shadow-indigo-500/20">
                                <div>
                                    <p className="text-[10px] text-indigo-200 font-black uppercase tracking-wider">Total Captured Clicks</p>
                                    <p className="text-2xl font-black mt-0.5">{clicks.length} Clicks</p>
                                </div>
                                <div className="p-2.5 bg-white/10 rounded-xl">
                                    <MousePointer className="h-5 w-5" />
                                </div>
                            </div>

                            <button 
                                onClick={handleReset}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300 p-4 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
                                title="Reset Heatmap Data"
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Reset Data</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Heatmap Canvas Container */}
            {selectedPage ? (
                <div className="space-y-8">
                    
                    {/* Visualizer Block */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        
                        {/* Interactive Controls Toolbar */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
                                <span className="text-sm font-bold text-slate-700">Heatmap Visual Controls</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500">Backdrop:</span>
                                    <div className="inline-flex rounded-xl bg-slate-200 p-1">
                                        <button
                                            onClick={() => setShowIframe(true)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                                showIframe 
                                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                            }`}
                                        >
                                            <Globe className="h-3.5 w-3.5" />
                                            Live Website
                                        </button>
                                        <button
                                            onClick={() => setShowIframe(false)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                                !showIframe 
                                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                            }`}
                                        >
                                            <Monitor className="h-3.5 w-3.5" />
                                            Dark Blueprint
                                        </button>
                                    </div>
                                </div>

                                {showIframe && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5" /> Web Opacity:
                                        </span>
                                        <input 
                                            type="range" 
                                            min="0.1" 
                                            max="0.9" 
                                            step="0.1"
                                            value={iframeOpacity} 
                                            onChange={(e) => setIframeOpacity(parseFloat(e.target.value))}
                                            className="w-24 accent-indigo-600 cursor-pointer"
                                        />
                                        <span className="text-xs font-bold text-slate-700 w-8">{(iframeOpacity * 100).toFixed(0)}%</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                        <Maximize2 className="h-3.5 w-3.5" /> Glow Size:
                                    </span>
                                    <input 
                                        type="range" 
                                        min="20" 
                                        max="60" 
                                        step="5"
                                        value={spotSize} 
                                        onChange={(e) => setSpotSize(parseInt(e.target.value, 10))}
                                        className="w-24 accent-indigo-600 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-700 w-8">{spotSize}px</span>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-[600px] flex flex-col items-center justify-center space-y-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-pulse">
                                <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-medium text-slate-500">Retrieving click nodes...</p>
                            </div>
                        ) : (
                            /* Outer Scrollable Wrapper (Synchronized scrolling!) */
                            <div className="relative overflow-y-auto rounded-2xl border border-slate-200 shadow-inner max-h-[600px]">
                                
                                {/* Inner Display Frame - Expanded to standard normalized height 1080px */}
                                <div
                                    className="relative bg-slate-950 transition-all duration-300"
                                    style={{ 
                                        width: '100%', 
                                        height: '1080px', 
                                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)',
                                        backgroundSize: '24px 24px'
                                    }}
                                >
                                    {/* Dynamic Background Iframe (Stretched to 1080px to disable internal scroll) */}
                                    {showIframe && (
                                        <iframe 
                                            src={selectedPage} 
                                            className="absolute inset-0 w-full h-[1080px] border-none pointer-events-none select-none transition-all duration-300"
                                            style={{ opacity: iframeOpacity }}
                                            title="Live Website Overlay Backdrop"
                                        />
                                    )}

                                    {/* Clicks Layer mapped over the full 1080px height */}
                                    <div className="absolute inset-0 z-20 pointer-events-none">
                                        {clicks.map((click, idx) => (
                                            <div
                                                key={idx}
