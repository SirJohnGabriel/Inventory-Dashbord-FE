import { useEffect } from 'react';

export function useRoutePreloading() {
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      import('@features/products').catch(() => {});
    }, 1000);

    const handleMouseMove = () => {
      import('@features/products').catch(() => {});
      document.removeEventListener('mousemove', handleMouseMove);
    };

    const handleUserInteraction = () => {
      import('@features/products').catch(() => {});
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('mousemove', handleMouseMove, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      clearTimeout(preloadTimer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);
}

export default useRoutePreloading;
