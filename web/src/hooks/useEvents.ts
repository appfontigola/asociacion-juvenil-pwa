import { useState, useEffect, useCallback } from 'react';
import { Event } from '../types';
import * as eventService from '../services/eventService';
import * as attendanceService from '../services/attendanceService';
import { AttendanceStatus, EventAttendance } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch {
      setError('Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getEvent = useCallback(async (id: string) => {
    try {
      return await eventService.getEventById(id);
    } catch {
      return null;
    }
  }, []);

  const createEvent = useCallback(
    async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newEvent = await eventService.createEvent(data);
        setEvents((prev) => [...prev, newEvent]);
        return newEvent;
      } catch {
        throw new Error('Error al crear evento');
      }
    },
    []
  );

  const editEvent = useCallback(
    async (
      id: string,
      data: { title: string; description: string; date: Date; time: string; location?: string }
    ) => {
      try {
        await eventService.updateEvent(id, data);
        setEvents((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, ...data, updatedAt: new Date() } : e
          )
        );
      } catch {
        throw new Error('Error al editar evento');
      }
    },
    []
  );

  const removeEvent = useCallback(async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      throw new Error('Error al eliminar evento');
    }
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    getEvent,
    createEvent,
    editEvent,
    removeEvent,
  };
};

export const useAttendance = (eventId: string) => {
  const [attendances, setAttendances] = useState<EventAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    try {
      const data = await attendanceService.getAttendanceByEvent(eventId);
      setAttendances(data);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const setStatus = useCallback(
    async (userId: string, userName: string, status: AttendanceStatus) => {
      try {
        await attendanceService.setAttendance(eventId, userId, userName, status);
        setAttendances((prev) => {
          const filtered = prev.filter((a) => a.userId !== userId);
          return [
            ...filtered,
            {
              id: `${eventId}_${userId}`,
              eventId,
              userId,
              userName,
              status,
              updatedAt: new Date(),
            },
          ];
        });
      } catch {
        throw new Error('Error al actualizar asistencia');
      }
    },
    [eventId]
  );

  const getUserStatus = useCallback(
    (userId: string): AttendanceStatus | null => {
      const attendance = attendances.find((a) => a.userId === userId);
      return attendance?.status || null;
    },
    [attendances]
  );

  const counts = {
    going: attendances.filter((a) => a.status === 'going').length,
    notGoing: attendances.filter((a) => a.status === 'not_going').length,
    undecided: attendances.filter((a) => a.status === 'undecided').length,
  };

  return {
    attendances,
    loading,
    counts,
    setStatus,
    getUserStatus,
  };
};
