import React from 'react';
import { NavProvider } from './NavContext';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import EventDetailScreen from '../screens/calendar/EventDetailScreen';
import CreateEventScreen from '../screens/calendar/CreateEventScreen';
import EditEventScreen from '../screens/calendar/EditEventScreen';

interface Props {
  parentNavigate?: (screen: string, params?: Record<string, any>) => void;
  parentGoBack?: () => void;
}

const CalendarStackNavigator: React.FC<Props> = ({ parentNavigate, parentGoBack }) => {
  return (
    <NavProvider
      initial="Calendar"
      screens={{
        Calendar: CalendarScreen,
        EventDetail: EventDetailScreen,
        CreateEvent: CreateEventScreen,
        EditEvent: EditEventScreen,
      }}
      parentNavigate={parentNavigate}
      parentGoBack={parentGoBack}
    />
  );
};

export default CalendarStackNavigator;