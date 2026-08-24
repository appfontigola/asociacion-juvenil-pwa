import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface CalendarGridProps {
  events: Event[];
  onDayPress?: (date: Date, dayEvents: Event[]) => void;
  selectedDate?: Date | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ events, onDayPress, selectedDate }) => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => today.getMonth());
  const [viewYear, setViewYear] = useState(() => today.getFullYear());

  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewMonth, viewYear]);

  const firstDayOfWeek = useMemo(() => {
    const d = new Date(viewYear, viewMonth, 1);
    let day = d.getDay();
    return day === 0 ? 6 : day - 1;
  }, [viewMonth, viewYear]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((e) => {
      const d = new Date(e.date);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  const isToday = (day: number) => {
    return (
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      viewYear === selectedDate.getFullYear() &&
      viewMonth === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    );
  };

  const getEventsForDay = (day: number): Event[] => {
    const key = `${viewYear}-${viewMonth}-${day}`;
    return eventsByDate[key] || [];
  };

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<View key={`empty-${i}`} style={styles.dayCell} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const hasEvents = dayEvents.length > 0;
    const isTodayDay = isToday(day);
    const isSelectedDay = isSelected(day);

    cells.push(
      <TouchableOpacity
        key={day}
        style={[
          styles.dayCell,
          isTodayDay && styles.todayCell,
          isSelectedDay && styles.selectedCell,
        ]}
        onPress={() => onDayPress?.(new Date(viewYear, viewMonth, day), dayEvents)}
        activeOpacity={0.6}
      >
        <Text
          style={[
            styles.dayText,
            isTodayDay && styles.todayText,
            isSelectedDay && styles.selectedText,
            hasEvents && !isTodayDay && !isSelectedDay && styles.eventDayText,
          ]}
        >
          {day}
        </Text>
        {hasEvents && (
          <View style={styles.dotRow}>
            {dayEvents.slice(0, 3).map((_, i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotPrimary]} />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToday}>
          <Text style={styles.monthTitle}>
            {MONTHS[viewMonth]} {viewYear}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d, i) => (
          <View key={`wd-${i}`} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>{cells}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  arrowBtn: {
    padding: spacing.sm,
  },
  arrowText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 30,
  },
  monthTitle: {
    ...typography.h3,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  weekdayText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  todayCell: {
    backgroundColor: colors.primary,
  },
  selectedCell: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '400',
  },
  todayText: {
    color: '#fff',
    fontWeight: '700',
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '700',
  },
  eventDayText: {
    color: colors.primary,
    fontWeight: '600',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  dotPrimary: {
    backgroundColor: colors.primary,
  },
});

export default CalendarGrid;
