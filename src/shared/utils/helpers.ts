export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(date);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export type BadgeType = 'planned' | 'active' | 'due-soon' | 'overdue';

export const getProjectBadgeType = (
  startDate?: string | null,
  dueDate?: string | null
): BadgeType => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Handle both formats: '0001-01-01' and '0001-01-01T00:00:00'
  const hasDueDate = dueDate && !dueDate.startsWith('0001-01-01');
  const hasStartDate = startDate && !startDate.startsWith('0001-01-01');

  if (!hasDueDate) {
    if (hasStartDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);

      if (!isNaN(startDateObj.getTime()) && currentDate >= startDateObj) {
        return 'active';
      } else {
        return 'planned';
      }
    }
    return 'planned';
  }

  const dueDateObj = new Date(dueDate!);
  dueDateObj.setHours(0, 0, 0, 0);

  if (isNaN(dueDateObj.getTime())) {
    return 'planned';
  }

  if (currentDate > dueDateObj) {
    return 'overdue';
  }

  const daysUntilDue = Math.ceil(
    (dueDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue <= 7) {
    return 'due-soon';
  }

  if (hasStartDate) {
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);

    if (!isNaN(startDateObj.getTime()) && currentDate < startDateObj) {
      return 'planned';
    }
  }

  return 'active';
};
