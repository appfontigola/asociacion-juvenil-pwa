import React, { useState } from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import AdminNavigator from './AdminNavigator';
import Loading from '../components/ui/Loading';
import { useAuth } from '../hooks/useAuth';
import { useDeepLinkCheckin } from '../hooks/useDeepLinkCheckin';

const AppNavigator: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);

  useDeepLinkCheckin(user?.id, user?.displayName);

  if (loading) {
    return <Loading fullScreen message="Iniciando..." />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (showAdmin) {
    return <AdminNavigator onClose={() => setShowAdmin(false)} />;
  }

  return <MainTabNavigator onOpenAdmin={() => setShowAdmin(true)} />;
};

export default AppNavigator;