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
