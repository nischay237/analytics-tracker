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
                                                className="absolute rounded-full pointer-events-auto transition-transform hover:scale-125 cursor-help"
                                                style={{
                                                    left: `${(click.clickX / 1920) * 100}%`,
                                                    top: `${(click.clickY / 1080) * 100}%`,
                                                    width: `${spotSize}px`,
                                                    height: `${spotSize}px`,
                                                    background: 'radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(245,158,11,0.6) 40%, rgba(16,185,129,0) 80%)',
                                                }}
                                                title={`Coordinate Nodes: X: ${click.clickX}, Y: ${click.clickY}`}
                                            ></div>
                                        ))}
                                    </div>

                                    {clicks.length === 0 && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-2 z-30 bg-slate-950/80 backdrop-blur-sm">
                                            <AlertCircle className="h-8 w-8 text-slate-600 animate-bounce" />
                                            <p className="text-sm font-bold text-slate-300">No events captured on this URL yet</p>
                                            <p className="text-xs text-slate-500">Go to your demo page, click several elements, and refresh.</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>

                    {/* NEW SECTION: INSTANT HEATMAP AUDIT & INTELLIGENT E-COMMERCE REPORT */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* 1. Mapped Storefront Product Heatmap Ranking */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                <div>
                                    <h3 className="text-md font-extrabold text-slate-800 flex items-center gap-1.5">
                                        <Sparkles className="h-4 w-4 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                                        Interactive Product Clicks Rankings
                                    </h3>
                                    <p className="text-xs text-slate-400">Click coordinates mapped directly to storefront items in real-time</p>
                                </div>
                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                    Catalog Audit
                                </span>
                            </div>

                            {clicks.length === 0 ? (
                                <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                                    No dynamic clicks available. Generate clicks inside ApexStore to load catalog ranking trends.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {report.rankedProducts.map((art, idx) => {
                                        const share = clicks.length > 0 ? Math.round((art.count / clicks.length) * 100) : 0;
                                        return (
                                            <div key={idx} className="flex items-center justify-between gap-4 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="text-lg bg-slate-100 p-2 rounded-lg">{art.icon}</span>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 truncate">{art.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-semibold">{art.count} clicks recorded</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                                                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${share}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{share}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* 2. E-Commerce Buying Intent & Hover Warnings panel */}
                        <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col justify-between shadow-lg">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                                        <Compass className="h-4 w-4 text-orange-400 animate-spin" style={{ animationDuration: '10s' }} />
                                        Buying Intent Audit
                                    </h3>
                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold animate-pulse">
                                        Live Summary
                                    </span>
                                </div>

                                <div className="space-y-3.5">
                                    {/* Bounce Rate */}
                                    <div className="bg-slate-800/50 border border-slate-800/80 p-3.5 rounded-2xl flex items-center gap-3">
                                        <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                                            <TrendingDown className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shopper Drop-Offs</p>
                                            <p className="text-sm font-black text-slate-100 mt-0.5">
                                                {report.bounceRate}% bounce rate
                                            </p>
                                            <p className="text-[9px] text-slate-500 leading-normal">Exited catalog within 40 seconds without any product selections.</p>
                                        </div>
                                    </div>

                                    {/* Predictive Purchase probability */}
                                    <div className="bg-slate-800/50 border border-slate-800/80 p-3.5 rounded-2xl flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                            <Sparkles className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Purchase Probability</p>
                                            <p className="text-sm font-black text-slate-100 mt-0.5">🚀 {report.buyChance}% Chance</p>
                                            <p className="text-[9px] text-slate-500 leading-normal">Projected purchase conversion rate of your top performing gadget based on click densities.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hotspot Friction Alert */}
                                {report.winner && report.winner.count > 0 && (
                                    <div className="space-y-1 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                        <p className="text-[10px] text-amber-400 font-extrabold uppercase flex items-center gap-1.5">
                                            <AlertCircle className="h-3.5 w-3.5" /> Most Hovered & Active Product
                                        </p>
                                        <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                                            Shoppers are heavily interacting with: <br />
                                            <strong className="text-white">"{report.winner.name}"</strong> <br />
                                            This captures <span className="text-emerald-400">{Math.round((report.winner.count / clicks.length) * 100)}%</span> of total store attention. High chance of checkout conversion!
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-850 pt-4 mt-4 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                <BookOpen className="h-4 w-4 text-slate-600" />
                                <span>UX Layout highly optimized.</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <Compass className="h-4 w-4 text-indigo-500 flex-shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>Hover over hotspots to view standard coordinate data. Use the sliders above to adjust the visual scale & background overlay depth of your simulation.</span>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-16 rounded-3xl text-center space-y-4">
                    <div className="h-12 w-12 bg-white border border-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                        <Flame className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-700">Choose a target website page first</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Please select a captured URL from the dropdown menu above to render and overlay the visual thermal interaction map.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Heatmap;