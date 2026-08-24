import React from 'react';
import { NavProvider } from './NavContext';
import AdminPanelScreen from '../screens/admin/AdminPanelScreen';
import CreateUserScreen from '../screens/admin/CreateUserScreen';
import EditUserScreen from '../screens/admin/EditUserScreen';
import ManageNoticesScreen from '../screens/admin/ManageNoticesScreen';
import ManageEventsScreen from '../screens/admin/ManageEventsScreen';
import AttendanceOverviewScreen from '../screens/admin/AttendanceOverviewScreen';
import PaymentsScreen from '../screens/admin/PaymentsScreen';
import QRScreen from '../screens/admin/QRScreen';
import LocalLogScreen from '../screens/admin/LocalLogScreen';
import KeysLogScreen from '../screens/admin/KeysLogScreen';
import CreateNoticeScreen from '../screens/notices/CreateNoticeScreen';
import EditNoticeScreen from '../screens/notices/EditNoticeScreen';
import CreateEventScreen from '../screens/calendar/CreateEventScreen';
import EditEventScreen from '../screens/calendar/EditEventScreen';

interface Props {
  onClose?: () => void;
}

const AdminNavigator: React.FC<Props> = ({ onClose }) => {
  return (
    <NavProvider
      initial="AdminPanel"
      screens={{
        AdminPanel: AdminPanelScreen,
        CreateUser: CreateUserScreen,
        EditUser: EditUserScreen,
        AdminNotices: ManageNoticesScreen,
        CreateNoticeAdmin: CreateNoticeScreen,
        EditNoticeAdmin: EditNoticeScreen,
        AdminEvents: ManageEventsScreen,
        CreateEventAdmin: CreateEventScreen,
        EditEventAdmin: EditEventScreen,
        AttendanceOverview: AttendanceOverviewScreen,
        Payments: PaymentsScreen,
        QRCheckin: QRScreen,
        LocalLog: LocalLogScreen,
        KeysLog: KeysLogScreen,
      }}
      parentGoBack={onClose}
    />
  );
};

export default AdminNavigator;
