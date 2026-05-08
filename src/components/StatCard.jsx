import React from 'react';

const StatCard = ({ title, value, icon: Icon, unit = '' }) => {
  return (
    <div className="glass-card p-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem' }}>{title}</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {value} <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>{unit}</span>
          </h3>
        </div>
        <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '0.75rem' }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
