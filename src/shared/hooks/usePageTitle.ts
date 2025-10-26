import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '@app/routes';

const BASE_TITLE = 'Inventory Dashboard';

export function usePageTitle(customTitle?: string) {
  const location = useLocation();

  useEffect(() => {
    if (customTitle) {
      document.title = `${customTitle} | ${BASE_TITLE}`;
      return;
    }

    // Find the current route based on pathname
    const currentRoute = routes.find(
      (route) => route.path === location.pathname
    );

    if (currentRoute) {
      document.title = `${currentRoute.name} | ${BASE_TITLE}`;
    } else {
      // Handle special cases
      switch (location.pathname) {
        case '/login':
          document.title = `Login | ${BASE_TITLE}`;
          break;
        case '/':
          document.title = BASE_TITLE;
          break;
        default:
          document.title = BASE_TITLE;
      }
    }
  }, [location.pathname, customTitle]);
}

export function setPageTitle(title: string) {
  document.title = `${title} | ${BASE_TITLE}`;
}

export function resetPageTitle() {
  document.title = BASE_TITLE;
}
