import React from 'react';
import { NavProvider } from './NavContext';
import NoticesListScreen from '../screens/notices/NoticesListScreen';
import NoticeDetailScreen from '../screens/notices/NoticeDetailScreen';
import CreateNoticeScreen from '../screens/notices/CreateNoticeScreen';
import EditNoticeScreen from '../screens/notices/EditNoticeScreen';

interface Props {
  parentNavigate?: (screen: string, params?: Record<string, any>) => void;
  parentGoBack?: () => void;
}

const NoticesStackNavigator: React.FC<Props> = ({ parentNavigate, parentGoBack }) => {
  return (
    <NavProvider
      initial="NoticesList"
      screens={{
        NoticesList: NoticesListScreen,
        NoticeDetail: NoticeDetailScreen,
        CreateNotice: CreateNoticeScreen,
        EditNotice: EditNoticeScreen,
      }}
      parentNavigate={parentNavigate}
      parentGoBack={parentGoBack}
    />
  );
};

export default NoticesStackNavigator;