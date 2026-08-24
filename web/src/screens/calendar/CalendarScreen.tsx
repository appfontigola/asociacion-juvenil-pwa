import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { useBadgesContext } from '../../contexts/BadgesContext';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { Event } from '../../types';
import { formatDate } from '../../utils/helpers';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import EventCard from '../../components/calendar/EventCard';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DOT_COLORS = [colors.primary, colors.secondary, colors.accent, colors.warning];

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number): number =>
  (new Date(year, month, 1).getDay() + 6) % 7;

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const pageStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  padding: `${spacing.md}px ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 24,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
};

const topBarTitleStyle: React.CSSProperties = {
  ...typography.h3,
  flex: 1,
};

const adminButtonStyle: React.CSSProperties = {
  background: 'none',
  border: `1.5px solid ${colors.primary}`,
  color: colors.primary,
  borderRadius: borderRadius.sm,
  padding: '6px 14px',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  fontFamily: 'inherit',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
};

const monthNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: spacing.md,
};

const navButtonStyle: React.CSSProperties = {
  background: 'none',
  border: `1px solid ${colors.border}`,
  color: colors.text,
  borderRadius: borderRadius.sm,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 18,
  fontFamily: 'inherit',
};

const monthLabelStyle: React.CSSProperties = {
  ...typography.h3,
  margin: 0,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 1,
  backgroundColor: colors.border,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  overflow: 'hidden',
  marginBottom: spacing.lg,
};

const dayHeaderStyle: React.CSSProperties = {
  backgroundColor: colors.surfaceLight,
  padding: '10px 0',
  textAlign: 'center',
  fontSize: 13,
  fontWeight: 600,
  color: colors.textMuted,
};

const dayCellBase: React.CSSProperties = {
  backgroundColor: colors.surface,
  padding: '8px 0',
  textAlign: 'center',
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
  border: 'none',
  color: colors.text,
  fontFamily: 'inherit',
};

const todayStyle: React.CSSProperties = {
  backgroundColor: colors.primaryDark,
  fontWeight: 700,
};

const selectedStyle: React.CSSProperties = {
  border: `2px solid ${colors.primary}`,
  borderRadius: borderRadius.sm,
};

const emptyCellStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  minHeight: 44,
};

const dotRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 3,
  justifyContent: 'center',
  marginTop: 2,
};

const dotStyle: React.CSSProperties = {
  width: 5,
  height: 5,
  borderRadius: '50%',
};

const sectionTitleStyle: React.CSSProperties = {
  ...typography.h3,
  margin: `0 0 ${spacing.sm}px 0`,
};

const selectedSectionStyle: React.CSSProperties = {
  marginBottom: spacing.lg,
};

const upcomingSectionStyle: React.CSSProperties = {
  marginBottom: spacing.lg,
};

const monthGroupHeaderStyle: React.CSSProperties = {
  ...typography.h3,
  color: colors.primary,
  margin: `${spacing.md}px 0 ${spacing.sm}px 0`,
};

const noEventsStyle: React.CSSProperties = {
  ...typography.bodySmall,
  textAlign: 'center',
  padding: spacing.lg,
  color: colors.textMuted,
};

const CalendarScreen: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const { isAdmin } = useAuth();
  const { markEventsSeen } = useBadgesContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    markEventsSeen();
  }, [markEventsSeen]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cellSize = 44;

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const eventsMap = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((ev) => {
      const key = `${ev.date.getFullYear()}-${ev.date.getMonth()}-${ev.date.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  const getEventsForDay = (day: number): Event[] => {
    const key = `${year}-${month}-${day}`;
    return eventsMap[key] || [];
  };

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    return eventsMap[key] || [];
  }, [selectedDate, eventsMap]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events
      .filter((ev) => ev.date.getTime() >= now.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  const groupedUpcoming = useMemo(() => {
    const groups: Record<string, Event[]> = {};
    upcomingEvents.forEach((ev) => {
      const key = `${MONTHS[ev.date.getMonth()]} ${ev.date.getFullYear()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    });
    return groups;
  }, [upcomingEvents]);

  const renderCalendarGrid = () => {
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} style={emptyCellStyle} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const isToday = isSameDay(dateObj, today);
      const isSelected = selectedDate && isSameDay(dateObj, selectedDate);
      const dayEvents = getEventsForDay(day);
      const dots = dayEvents.slice(0, 4);

      cells.push(
        <button
          key={`day-${day}`}
          style={{
            ...dayCellBase,
            ...(isToday ? todayStyle : {}),
            ...(isSelected ? selectedStyle : {}),
          }}
          onClick={() => handleDayClick(day)}
          onMouseEnter={(e) => {
            if (!isToday) {
              (e.currentTarget as HTMLElement).style.backgroundColor = colors.surfaceLight;
            }
          }}
          onMouseLeave={(e) => {
            if (!isToday) {
              (e.currentTarget as HTMLElement).style.backgroundColor = colors.surface;
            }
          }}
        >
          <span>{day}</span>
          {dots.length > 0 && (
            <div style={dotRowStyle}>
              {dots.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    ...dotStyle,
                    backgroundColor: DOT_COLORS[idx % DOT_COLORS.length],
                  }}
                />
              ))}
            </div>
          )}
        </button>
      );
    }
    return cells;
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <Loading message="Cargando calendario..." />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/')}>
          ‹
        </button>
        <span style={topBarTitleStyle}>Calendario</span>
        {isAdmin && (
          <button
            style={adminButtonStyle}
            onClick={() => navigate('/calendar/create')}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary;
              (e.currentTarget as HTMLElement).style.color = '#FEF5E6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = colors.primary;
            }}
          >
            + Nueva
          </button>
        )}
      </div>
      <div style={contentStyle}>
        <div style={monthNavStyle}>
          <button style={navButtonStyle} onClick={handlePrevMonth}>
            ‹
          </button>
          <h2 style={monthLabelStyle}>
            {MONTHS[month]} {year}
          </h2>
          <button style={navButtonStyle} onClick={handleNextMonth}>
            ›
          </button>
        </div>

        <div style={gridStyle}>
          {DAY_HEADERS.map((header) => (
            <div key={header} style={dayHeaderStyle}>
              {header}
            </div>
          ))}
          {renderCalendarGrid()}
        </div>

        {selectedDate && (
          <div style={selectedSectionStyle}>
            <h3 style={sectionTitleStyle}>
              Actividades del {formatDate(selectedDate)}
            </h3>
            {selectedDayEvents.length === 0 ? (
              <p style={noEventsStyle}>Sin actividades este día</p>
            ) : (
              selectedDayEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onPress={() => navigate(`/calendar/event/${ev.id}`)}
                />
              ))
            )}
          </div>
        )}

        <div style={upcomingSectionStyle}>
          <h3 style={sectionTitleStyle}>Próximas actividades</h3>
          {upcomingEvents.length === 0 ? (
            <EmptyState
              title="No hay actividades"
              message="No hay próximas actividades programadas."
            />
          ) : (
            Object.entries(groupedUpcoming).map(([groupLabel, groupEvents]) => (
              <div key={groupLabel}>
                <h4 style={monthGroupHeaderStyle}>{groupLabel}</h4>
                {groupEvents.map((ev) => (
                  <div key={ev.id} style={{ marginBottom: spacing.sm }}>
                    <EventCard
                      event={ev}
                      onPress={() => navigate(`/calendar/event/${ev.id}`)}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;
