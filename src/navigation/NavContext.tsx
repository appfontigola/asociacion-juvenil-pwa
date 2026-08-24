import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface NavContextValue {
  navigate: (screen: string, params?: Record<string, any>) => void;
  goBack: () => void;
  routeParams: Record<string, any>;
  screenName: string;
  addFocusListener: (callback: () => void) => () => void;
}

export const NavContext = createContext<NavContextValue | null>(null);

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within a NavProvider');
  return ctx;
}

interface ScreenEntry {
  name: string;
  params: Record<string, any>;
}

interface NavProviderProps {
  initial: string;
  screens: Record<string, React.ComponentType<any>>;
  parentNavigate?: (screen: string, params?: Record<string, any>) => void;
  parentGoBack?: () => void;
}

export const NavProvider: React.FC<NavProviderProps> = ({
  initial,
  screens,
  parentNavigate,
  parentGoBack,
}) => {
  const [stack, setStack] = useState<ScreenEntry[]>([{ name: initial, params: {} }]);
  const focusListenersRef = useRef<Set<() => void>>(new Set());

  const current = stack[stack.length - 1];

  const navigate = useCallback(
    (screen: string, params?: Record<string, any>) => {
      if (screen in screens) {
        setStack(prev => [...prev, { name: screen, params: params || {} }]);
      } else if (parentNavigate) {
        parentNavigate(screen, params);
      }
    },
    [screens, parentNavigate]
  );

  const goBack = useCallback(() => {
    if (stack.length > 1) {
      setStack(prev => prev.slice(0, -1));
    } else if (parentGoBack) {
      parentGoBack();
    }
  }, [stack.length, parentGoBack]);

  const addFocusListener = useCallback((callback: () => void) => {
    focusListenersRef.current.add(callback);
    callback();
    return () => {
      focusListenersRef.current.delete(callback);
    };
  }, []);

  const ScreenComponent = screens[current.name];
  if (!ScreenComponent) return null;

  return (
    <NavContext.Provider
      value={{
        navigate,
        goBack,
        routeParams: current.params,
        screenName: current.name,
        addFocusListener,
      }}
    >
      <ScreenComponent />
    </NavContext.Provider>
  );
};

export function withNav<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  screenName: string
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  const WithNav: React.FC<P> = (props) => {
    const nav = useNav();
    const navigationProp = {
      navigate: nav.navigate,
      goBack: nav.goBack,
      addListener: (event: string, callback: () => void) => {
        if (event === 'focus') return nav.addFocusListener(callback);
        return () => {};
      },
      getParent: () => null,
      reset: () => {},
      isFocused: () => true,
      setParams: () => {},
      dispatch: () => {},
      addEventListener: () => () => {},
    };
    const routeProp = { params: nav.routeParams, name: screenName, key: screenName };
    return <WrappedComponent {...props} navigation={navigationProp} route={routeProp} />;
  };
  WithNav.displayName = `withNav(${displayName})`;
  return WithNav;
}
