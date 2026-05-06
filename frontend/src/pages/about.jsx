import React from 'react';
import { 
    Sparkles, 
    Bot, 
    Activity, 
    Map, 
    Terminal, 
    Heart, 
    User, 
    FolderGit,
    CheckCircle2,
    Lock
} from 'lucide-react';

function About() {
    return (
        <div className="space-y-12 max-w-6xl mx-auto font-sans pb-16">
            
            {/* 1. HERO GRADIENT HEADER - Introducing Nishchay */}
            <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="space-y-3 text-center md:text-left">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
                            <Sparkles className="h-3.5 w-3.5" /> Project Architect Profile
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                            Tracker.io SaaS Platform
                        </h1>
                        <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
                            This enterprise-scale, production-ready e-commerce behavior analytics tracker and visual mapping suit is architected and built by 
                            <strong className="text-white font-black bg-indigo-600/20 border border-indigo-500/30 px-2 py-0.5 rounded-lg ml-1">Nishchay Srivastava</strong>.
                        </p>
                    </div>

                    {/* Developer Card Badge */}
                    <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-lg w-56 backdrop-blur-md">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-3 animate-pulse">
                            <User className="h-8 w-8" />
                        </div>
                        <h4 className="text-sm font-black text-white">Nishchay Srivastava</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Full-Stack Engineer</p>
                        <div className="flex gap-2 mt-4 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Core Developer
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. THE POWER-PACKED FEATURES GRID (Pictures & Layouts) */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <FolderGit className="h-6 w-6 text-indigo-600" />
                        What is Inside Nishchay's Tracker?
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Explore the robust full-stack utility modules developed inside this analytics suit</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* FEATURE CARD 1: Click Heatmaps */}
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group">
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                            alt="Heatmap Visualizer" 
                            className="w-full h-52 object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-orange-50 border border-orange-100 text-orange-600 px-2.5 py-1 rounded-full">
                                    <Map className="h-3 w-3" /> Click Mapping
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">Viewport Normalized</span>
                            </div>
                            <h3 className="text-md font-bold text-slate-900">1. Interactive Viewport Click Heatmaps</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Tracks real-time cursor coordinate clicks and normalizes them into a precise 1920x1080 scaling grid. Clicks are beautifully mapped as glowing radial thermal points overlaid directly on top of your live website iframe with dynamic opacity and spot-size controllers [2].
                            </p>
                        </div>
                    </div>

                    {/* FEATURE CARD 2: Tracker Bot v2.0 */}
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group">
                        <img 
                            src="https://images.unsplash.com/photo-1531746790731-6c087fdec776?auto=format&fit=crop&w=800&q=80" 
                            alt="AI Chatbot Copilot" 
                            className="w-full h-52 object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full">
                                    <Bot className="h-3 w-3" /> Conversational AI
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">Database Aware</span>
                            </div>
                            <h3 className="text-md font-bold text-slate-900">2. Real-Time Analytics Tracker Bot</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                A highly advanced conversational chatbot containing 24 distinct quick-audit questions. Rather than throwing pre-saved static texts, it directly queries live MongoDB session collections in real-time to compute dynamic sales values, device splits, and UX recommendations [1].
                            </p>
                        </div>
                    </div>

                    {/* FEATURE CARD 3: Funnel & Business Audit */}
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group">
                        <img 
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                            alt="E-Commerce Funnel Analytics" 
                            className="w-full h-52 object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full">
                                    <Target className="h-3 w-3" /> Shopping Funnels
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">CRUD Integrated</span>
                            </div>
                            <h3 className="text-md font-bold text-slate-900">3. Purchase Funnels & Sales Reporting</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Monitors total shopper revenues, average order value (AOV), and cart abandonment rates. Renders an interactive funnel diagram illustrating transition rates from product details views -> add to carts -> checkout drawer triggers to completed sales transactions.
                            </p>
                        </div>
                    </div>

                    {/* FEATURE CARD 4: User Journey Connection Timelines */}
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group">
                        <img 
                            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" 
                            alt="User Journey Timeline" 
                            className="w-full h-52 object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-purple-50 border border-purple-100 text-purple-600 px-2.5 py-1 rounded-full">
                                    <Activity className="h-3 w-3" /> Session Mapping
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">Chronological Logs</span>
                            </div>
                            <h3 className="text-md font-bold text-slate-900">4. Interactive User Journey Timelines</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Evaluates raw database events and formats them sequentially on an elegant connected timeline interface. Dynamically displays indices for clicks, exact pixel positions, hover focuses, page loads, and active reading session times.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. DYNAMIC METRICS FOR SYSTEM STATS */}
            <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200/60 flex flex-col md:flex-row justify-between gap-6 items-center">
                <div className="space-y-1.5 text-center md:text-left">
                    <h3 className="text-md font-bold text-slate-800 flex items-center justify-center md:justify-start gap-1.5">
                        <Terminal className="h-5 w-5 text-indigo-600" />
                        Developer Automation Embedded
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                        Features fully automated cross-platform startup automation scripts (<strong>`start-project.bat`</strong> and <strong>`start-project.sh`</strong>) initializing complete servers and storefront previews concurrently in a single double-click [1]!
                    </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-extrabold tracking-wider bg-white px-4 py-2 border border-slate-200 rounded-full shadow-sm">
                    Made with <Heart className="h-4 w-4 text-rose-500 animate-beat fill-rose-500" /> by Nishchay Srivastava
                </div>
            </div>

        </div>
    );
}

export default About;