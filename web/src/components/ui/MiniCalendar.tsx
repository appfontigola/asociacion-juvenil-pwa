import React, { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface MiniCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const containerStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  marginBottom: spacing.lg,
  border: `1px solid ${colors.border}`,
};

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: spacing.sm,
};

const monthLabelStyle: React.CSSProperties = {
  ...typography.body,
  fontWeight: 600,
  color: '#FEF5E6',
};

const navBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 18,
  cursor: 'pointer',
  padding: '4px 8px',
  fontWeight: 700,
};

const weekdaysRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 2,
  marginBottom: 4,
};

const weekdayLabelStyle: React.CSSProperties = {
  ...typography.caption,
  color: colors.textMuted,
  textAlign: 'center',
  fontWeight: 600,
  fontSize: 11,
};

const daysGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 2,
};

const dayBtnBase: React.CSSProperties = {
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: borderRadius.sm,
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'inherit',
};

const dayBtnEmpty: React.CSSProperties = {
  ...dayBtnBase,
  background: 'transparent',
  cursor: 'default',
};

const dayBtnNormal: React.CSSProperties = {
  ...dayBtnBase,
  background: 'transparent',
  color: colors.text,
};

const dayBtnToday: React.CSSProperties = {
  ...dayBtnBase,
  background: 'rgba(255, 114, 35, 0.2)',
  color: colors.primary,
  fontWeight: 700,
};

const dayBtnSelected: React.CSSProperties = {
  ...dayBtnBase,
  background: colors.primary,
  color: '#FEF5E6',
  fontWeight: 700,
};

const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [viewDate, setViewDate] = useState(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  });

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const formatDateStr = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <button style={navBtnStyle} onClick={prevMonth}>‹</button>
        <span style={monthLabelStyle}>{MONTHS[month]} {year}</span>
        <button style={navBtnStyle} onClick={nextMonth}>›</button>
      </div>
      <div style={weekdaysRowStyle}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={weekdayLabelStyle}>{w}</div>
        ))}
      </div>
      <div style={daysGridStyle}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} style={dayBtnEmpty} />;
          const dateStr = formatDateStr(year, month, day);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          return (
            <button
              key={dateStr}
              style={isSelected ? dayBtnSelected : isToday ? dayBtnToday : dayBtnNormal}
              onClick={() => onDateSelect(dateStr)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
