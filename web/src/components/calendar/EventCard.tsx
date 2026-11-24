import React from 'react';
import { colors, spacing, borderRadius, typography, gradients } from '../../constants/theme';
import { Event } from '../../types';
import { formatDate } from '../../utils/helpers';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const cardStyle = (isSergio: boolean): React.CSSProperties => ({
  background: isSergio ? gradients.cardOrange : gradients.card,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
  border: `1px solid ${isSergio ? 'rgba(255, 114, 35, 0.3)' : 'rgba(78, 138, 188, 0.3)'}`,
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
});

const titleStyle: React.CSSProperties = {
  ...typography.body,
  fontWeight: 600,
  margin: 0,
  marginBottom: spacing.xs,
};

const detailStyle: React.CSSProperties = {
  ...typography.caption,
  margin: 0,
};

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const isSergio = event.authorName === 'Sergio';
  return (
    <div
      style={cardStyle(isSergio)}
      onClick={onPress}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = '0.85';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = '1';
      }}
    >
      <p style={titleStyle}>{event.title}</p>
      <p style={detailStyle}>
        {formatDate(event.date)} — {event.time}
      </p>
      {event.location && <p style={detailStyle}>{event.location}</p>}
    </div>
  );
};

export default EventCard;
