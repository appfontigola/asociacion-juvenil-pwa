import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBadgesContext } from '../contexts/BadgesContext';
import { colors, gradients, typography } from '../constants/theme';

const TABS = [
  { key: '/', icon: '🏠', label: 'Inicio' },
  { key: '/notices', icon: '📢', label: 'Avisos' },
  { key: '/calendar', icon: '📅', label: 'Calendario' },
  { key: '/local', icon: '📍', label: 'Local' },
  { key: '/profile', icon: '👤', label: 'Perfil' },
];

const TabLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { unreadNotices, unreadEvents } = useBadgesContext();

  const activeTab = TABS.find((t) => {
    if (t.key === '/') return location.pathname === '/';
    return location.pathname.startsWith(t.key);
  })?.key || '/';

  const tabs = isAdmin
    ? [...TABS, { key: '/admin', icon: '🛠️', label: 'Admin' }]
    : TABS;

  const badgeCountFor = (key: string): number => {
    if (key === '/notices') return unreadNotices;
    if (key === '/calendar') return unreadEvents;
    return 0;
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Outlet />
      </div>
      <div style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const badgeCount = badgeCountFor(tab.key);
          return (
            <button
              key={tab.key}
              style={{
                ...styles.tabItem,
                opacity: isActive ? 1 : 0.5,
              }}
              onClick={() => navigate(tab.key)}
            >
              <div style={styles.tabIconWrap}>
                {isActive && <span style={styles.tabActivePill} />}
                <div style={styles.tabIcon}>{tab.icon}</div>
                {badgeCount > 0 && (
                  <span style={styles.tabBadge}>
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>
              <div style={{
                ...styles.tabLabel,
                color: isActive ? colors.text : colors.textMuted,
                fontWeight: isActive ? '700' as const : '500' as const,
              }}>
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    paddingBottom: 96,
  },
  tabBar: {
    position: 'fixed',
    left: 14,
    right: 14,
    bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '6px 8px',
    borderRadius: 22,
    background: gradients.tabBar,
    border: '1px solid rgba(255, 114, 35, 0.35)',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(254, 190, 15, 0.08)',
    flexShrink: 0,
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '4px 0',
    fontFamily: 'inherit',
  },
  tabIconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 34,
  },
  tabActivePill: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    right: 2,
    borderRadius: 13,
    background: gradients.primary,
    boxShadow: '0 4px 14px rgba(255, 114, 35, 0.5)',
  },
  tabIcon: {
    fontSize: 20,
    lineHeight: '24px',
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    padding: '0 5px',
    borderRadius: 9,
    background: gradients.primary,
    border: '2px solid #0B151D',
    color: '#FEF5E6',
    fontSize: 11,
    fontWeight: 800,
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    position: 'relative',
  },
};

export default TabLayout;
