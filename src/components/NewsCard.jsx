import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';

const NewsCard = ({ article }) => {
  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.3s ease' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img 
          src={article.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'} 
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '0.2rem 0.5rem', background: 'var(--primary)', color: '#fff', fontSize: '0.6rem', fontWeight: 'bold', borderRadius: '4px', textTransform: 'uppercase' }}>
          {article.source.name}
        </div>
      </div>
      
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
          {article.description}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div className="flex items-center gap-1"><Calendar size={12} /> {date}</div>
          <div className="flex items-center gap-1"><User size={12} /> {article.author || 'Global'}</div>
        </div>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.2s' }}
        >
          Read More <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
