import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { BarChart3, Activity, Map, Layers, Bot } from 'lucide-react'; // <-- Bot icon add kiya
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import Heatmap from './pages/Heatmap';
import TrackerBot from './pages/TrackerBot'; // <-- New Bot page import kiya

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
                {/* Modern Sidebar */}
                <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
                    <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
                        <BarChart3 className="h-6 w-6 text-indigo-400 animate-pulse" />
                        <span className="text-lg font-black tracking-wider text-white">Tracker.io</span>
                    </div>
                    
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    isActive 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <Activity className="h-5 w-5" />
                            <span>Sessions</span>
                        </NavLink>
                        
                        <NavLink 
                            to="/heatmap" 
                            className={({ isActive }) => 
                                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    isActive 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <Map className="h-5 w-5" />
                            <span>Heatmap</span>
                        </NavLink>

                        {/* NEW TRACKER BOT LINK */}
                        <NavLink 
                            to="/bot" 
                            className={({ isActive }) => 
                                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    isActive 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <Bot className="h-5 w-5" />
                            <span>Tracker Bot</span>
                        </NavLink>
                    </nav>

                    <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                        v1.0.0 • Analytics Panel
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col">
                    {/* Top Header */}
                    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-indigo-500" />
                            Console Dashboard
                        </h2>
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                                Live Tracker Active
                            </span>
                        </div>
                    </header>

                    {/* Page Content Container */}
                    <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/session/:sessionId" element={<SessionDetail />} />
                            <Route path="/heatmap" element={<Heatmap />} />
                            <Route path="/bot" element={<TrackerBot />} /> {/* <-- New Bot Route */}
                        </Routes>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;