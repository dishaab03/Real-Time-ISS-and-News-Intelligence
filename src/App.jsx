import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Moon, 
  Sun, 
  AlertTriangle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Hooks
import { useISS } from './hooks/useISS';
import { useNews } from './hooks/useNews';
import { useChat } from './hooks/useChat';

// Components
import ISSMap from './components/ISSMap';
import NewsCard from './components/NewsCard';
import ChatWindow from './components/ChatWindow';
import SpeedChart from './components/SpeedChart';

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const iss = useISS();
  const news = useNews();
  const chat = useChat({ iss, news });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const processedNews = useMemo(() => {
    if (!news?.articles) return [];
    let result = [...news.articles];
    if (searchQuery) {
      result = result.filter(a => 
        (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.source?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else {
      result.sort((a, b) => (a.source?.name || '').localeCompare(b.source?.name || ''));
    }
    return result;
  }, [news?.articles, searchQuery, sortBy]);

  return (
    <div className="dashboard-wrapper">
      <Toaster position="bottom-left" />

      {/* Main Header */}
      <header className="header">
        <div>
          <p className="header-label">MISSION CONTROL DASHBOARD</p>
          <h1 className="header-title">Real-Time ISS and News Intelligence</h1>
        </div>
        <button onClick={() => setIsDark(!isDark)} className="theme-toggle flex items-center gap-2">
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          Switch to {isDark ? 'Light' : 'Dark'}
        </button>
      </header>

      {/* Top Grid */}
      <div className="layout-grid">
        
        {/* Left: ISS Tracking */}
        <section className="card iss-tracking-card">
          <div className="card-header">
            <h2 className="card-title">ISS Live Tracking</h2>
            <div className="button-group">
              <button onClick={iss.refresh} className="btn-small">Refresh Now</button>
              <div className="badge-live">
                <div className="badge-dot animate-pulse"></div>
                Auto-Refresh: ON
              </div>
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-box">
              <p className="stat-label">Latitude / Longitude</p>
              <p className="stat-value">
                {iss.position ? `${iss.position.lat.toFixed(3)}, ${iss.position.lng.toFixed(3)}` : '0.000, 0.000'}
              </p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Speed</p>
              <p className="stat-value">
                {iss.speed ? `${iss.speed.toFixed(2)} km/h` : '0.00 km/h'}
              </p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Nearest Place</p>
              <p className="stat-value" style={{ fontSize: '0.85rem' }}>
                {iss.nearestPlace || 'Detecting...'}
              </p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Tracked Positions</p>
              <p className="stat-value">{iss.history.length}</p>
            </div>
          </div>

          <div className="map-view">
             <ISSMap position={iss.position} history={iss.history} />
          </div>
        </section>

        {/* Right: Speed Trend */}
        <section className="card">
          <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>ISS Speed Trend</h2>
          <div style={{ height: '420px' }}>
            <SpeedChart history={iss.history} />
          </div>
        </section>
      </div>

      {/* Bottom: News */}
      <section className="card news-section">
        <div className="card-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">Breaking News</h2>
          <button onClick={news.refresh} className="btn-small flex items-center gap-2">
            <RefreshCw size={14} className={news.loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div className="news-filters">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search title, source, author..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="source">Sort by Source</option>
          </select>
        </div>

        {news.error ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertTriangle size={32} className="text-danger mb-2" style={{ margin: '0 auto' }} />
            <p className="font-bold">{news.error}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {processedNews.map((article, idx) => (
              <NewsCard key={idx} article={article} />
            ))}
          </div>
        )}
      </section>

      <ChatWindow 
        messages={chat.messages} 
        onSend={chat.sendMessage} 
        isTyping={chat.isTyping} 
        error={chat.error}
        onClear={chat.clearChat}
      />
    </div>
  );
}

export default App;
