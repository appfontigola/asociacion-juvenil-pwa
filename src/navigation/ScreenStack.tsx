import React, { createContext, useContext, useState, useCallback } from 'react';

interface ScreenConfig {
  name: string;
  params?: Record<string, any>;
}

interface NavContextValue {
  navigate: (name: string, params?: Record<string, any>) => void;
  goBack: () => void;
  route: { params: Record<string, any> };
}

const NavContext = createContext<NavContextValue>(null!);
export const useScreenNav = () => useContext(NavContext);

interface ScreenStackProps {
  initial: string;
  screens: Record<string, React.ComponentType<any>>;
}

export const ScreenStack: React.FC<ScreenStackProps> = ({ initial, screens }) => {
  const [stack, setStack] = useState<ScreenConfig[]>([{ name: initial }]);

  const navigate = useCallback((name: string, params?: Record<string, any>) => {
    setStack(prev => [...prev, { name, params }]);
  }, []);

  const goBack = useCallback(() => {
    setStack(prev => prev.slice(0, -1));
  }, []);

  const current = stack[stack.length - 1];
  const ScreenComponent = screens[current.name];

  const navValue: NavContextValue = {
    navigate,
    goBack,
    route: { params: current.params || {} },
  };

  if (!ScreenComponent) {
    return null;
  }

  return (
    <NavContext.Provider value={navValue}>
      <ScreenComponent />
    </NavContext.Provider>
  );
};