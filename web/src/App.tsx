import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Loading from './components/ui/Loading';
import { setUserPresence } from './services/localService';
import { initOneSignal } from './services/oneSignalInit';
import LoginScreen from './screens/auth/LoginScreen';
import HomeScreen from './screens/home/HomeScreen';
import NoticesListScreen from './screens/notices/NoticesListScreen';
import NoticeDetailScreen from './screens/notices/NoticeDetailScreen';
import CreateNoticeScreen from './screens/notices/CreateNoticeScreen';
import EditNoticeScreen from './screens/notices/EditNoticeScreen';
import CalendarScreen from './screens/calendar/CalendarScreen';
import EventDetailScreen from './screens/calendar/EventDetailScreen';
import CreateEventScreen from './screens/calendar/CreateEventScreen';
import EditEventScreen from './screens/calendar/EditEventScreen';
import LocalScreen from './screens/local/LocalScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import AdminPanelScreen from './screens/admin/AdminPanelScreen';
import CreateUserScreen from './screens/admin/CreateUserScreen';
import EditUserScreen from './screens/admin/EditUserScreen';
import ManageNoticesScreen from './screens/admin/ManageNoticesScreen';
import ManageEventsScreen from './screens/admin/ManageEventsScreen';
import ManageUsersScreen from './screens/admin/ManageUsersScreen';
import AttendanceOverviewScreen from './screens/admin/AttendanceOverviewScreen';
import PaymentsScreen from './screens/admin/PaymentsScreen';
import QRScreen from './screens/admin/QRScreen';
import LocalLogScreen from './screens/admin/LocalLogScreen';
import KeysLogScreen from './screens/admin/KeysLogScreen';
import AlarmLogScreen from './screens/admin/AlarmLogScreen';
import ManualScreen from './screens/help/ManualScreen';
import ShoppingListScreen from './screens/local/ShoppingListScreen';
import PasajeScreen from './screens/pasaje/PasajeScreen';
import PasajeVideosScreen from './screens/pasaje/PasajeVideosScreen';
import PasajeLogScreen from './screens/admin/PasajeLogScreen';
import BuzonScreen from './screens/buzon/BuzonScreen';
import BuzonLogScreen from './screens/admin/BuzonLogScreen';
import DropboxConnectScreen from './screens/admin/DropboxConnectScreen';
import TabLayout from './components/TabLayout';
import InstallPage from './components/InstallPage';
import { handleOAuthCallback } from './services/dropboxService';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [searchParams] = useSearchParams();
  if (loading) return <Loading fullScreen />;
  if (!isAuthenticated) {
    const param = searchParams.has('checkin') ? 'checkin' : searchParams.has('checkout') ? 'checkout' : '';
    const qs = param ? `?${param}` : '';
    return <Navigate to={`/login${qs}`} replace />;
  }
  return <>{children}</>;
};

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true;
}

const App: React.FC = () => {
  const [standalone] = useState(isStandalone);
  const { user, isAuthenticated, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const checkedIn = useRef(false);
  const oauthProcessed = useRef(false);

  useEffect(() => {
    if (!standalone) return;
    initOneSignal();
  }, [standalone]);

  useEffect(() => {
    if (oauthProcessed.current) return;
    const code = searchParams.get('code');
    const state = searchParams.get('state') || '';
    if (code) {
      oauthProcessed.current = true;
      handleOAuthCallback(code, state).then((ok) => {
        window.alert(ok ? 'Dropbox conectado correctamente' : 'Error al conectar Dropbox');
        searchParams.delete('code');
        searchParams.delete('state');
        setSearchParams(searchParams, { replace: true });
      });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (checkedIn.current || !user) return;
    if (searchParams.has('checkin')) {
      checkedIn.current = true;
      setUserPresence(user.id, user.displayName, true, user.photoURL).catch(() => {});
      searchParams.delete('checkin');
      setSearchParams(searchParams, { replace: true });
      window.alert('¡Te has marcado como presente en el local!');
    } else if (searchParams.has('checkout')) {
      checkedIn.current = true;
      setUserPresence(user.id, user.displayName, false, user.photoURL).catch(() => {});
      searchParams.delete('checkout');
      setSearchParams(searchParams, { replace: true });
      window.alert('¡Has marcado tu salida del local!');
    }
  }, [user, searchParams, setSearchParams]);

  if (!standalone) return <InstallPage />;

  if (loading) return <Loading fullScreen message="Iniciando..." />;

  return (
    <div style={styles.root}>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginScreen />
        } />
        <Route element={<ProtectedRoute><TabLayout /></ProtectedRoute>}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/notices" element={<NoticesListScreen />} />
          <Route path="/calendar" element={<CalendarScreen />} />
          <Route path="/local" element={<LocalScreen />} />
          <Route path="/pasaje" element={<PasajeScreen />} />
          <Route path="/buzon" element={<BuzonScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/admin" element={<AdminPanelScreen />} />
        </Route>
        <Route path="/pasaje/videos" element={<ProtectedRoute><PasajeVideosScreen /></ProtectedRoute>} />
        <Route path="/notices/detail/:noticeId" element={<ProtectedRoute><NoticeDetailScreen /></ProtectedRoute>} />
        <Route path="/notices/create" element={<ProtectedRoute><CreateNoticeScreen /></ProtectedRoute>} />
        <Route path="/notices/edit/:noticeId" element={<ProtectedRoute><EditNoticeScreen /></ProtectedRoute>} />
        <Route path="/calendar/event/:eventId" element={<ProtectedRoute><EventDetailScreen /></ProtectedRoute>} />
        <Route path="/calendar/create" element={<ProtectedRoute><CreateEventScreen /></ProtectedRoute>} />
        <Route path="/calendar/edit/:eventId" element={<ProtectedRoute><EditEventScreen /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><ManageUsersScreen /></ProtectedRoute>} />
        <Route path="/admin/create-user" element={<ProtectedRoute><CreateUserScreen /></ProtectedRoute>} />
        <Route path="/admin/edit-user/:userId" element={<ProtectedRoute><EditUserScreen /></ProtectedRoute>} />
        <Route path="/admin/notices" element={<ProtectedRoute><ManageNoticesScreen /></ProtectedRoute>} />
        <Route path="/admin/create-notice" element={<ProtectedRoute><CreateNoticeScreen /></ProtectedRoute>} />
        <Route path="/admin/edit-notice/:noticeId" element={<ProtectedRoute><EditNoticeScreen /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute><ManageEventsScreen /></ProtectedRoute>} />
        <Route path="/admin/create-event" element={<ProtectedRoute><CreateEventScreen /></ProtectedRoute>} />
        <Route path="/admin/edit-event/:eventId" element={<ProtectedRoute><EditEventScreen /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute><AttendanceOverviewScreen /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><PaymentsScreen /></ProtectedRoute>} />
        <Route path="/admin/qr" element={<ProtectedRoute><QRScreen /></ProtectedRoute>} />
        <Route path="/admin/local-log" element={<ProtectedRoute><LocalLogScreen /></ProtectedRoute>} />
        <Route path="/admin/pasaje-log" element={<ProtectedRoute><PasajeLogScreen /></ProtectedRoute>} />
        <Route path="/admin/buzon" element={<ProtectedRoute><BuzonLogScreen /></ProtectedRoute>} />
        <Route path="/admin/keys-log" element={<ProtectedRoute><KeysLogScreen /></ProtectedRoute>} />
        <Route path="/admin/alarm-log" element={<ProtectedRoute><AlarmLogScreen /></ProtectedRoute>} />
        <Route path="/admin/dropbox" element={<ProtectedRoute><DropboxConnectScreen /></ProtectedRoute>} />
        <Route path="/manual" element={<ProtectedRoute><ManualScreen /></ProtectedRoute>} />
        <Route path="/local/shopping" element={<ProtectedRoute><ShoppingListScreen /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default App;
