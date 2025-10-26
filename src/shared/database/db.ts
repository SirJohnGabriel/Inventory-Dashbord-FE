import type { AuthUser } from '@shared/types';
import { isDevelopment, logger } from '@shared/utils';
import Dexie, { type EntityTable } from 'dexie';

// Define the database schema
export interface InventoryDashboardDB extends Dexie {
  users: EntityTable<AuthUser, 'id'>;
  // Add more tables as needed
}

// Create the database instance
export const db = new Dexie('InventoryDashboard') as InventoryDashboardDB;

// Define schemas
db.version(1).stores({
  users: '&id, name, email, role, createdAt, updatedAt',
  // Add more table schemas here
});

// Database initialization
export const initializeDatabase = async () => {
  try {
    await db.open();
    if (isDevelopment()) {
      logger.info('Database initialized successfully');
    }

    // Add any initial data setup here if needed
    const userCount = await db.users.count();
    if (userCount === 0) {
      // Add sample data for development
      await db.users.add({
        id: '1',
        name: 'Admin',
        email: 'admin@email.com',
        role: 'Admin',
      });
    }
  } catch (error) {
    if (isDevelopment()) {
      logger.error('Failed to initialize database:', error);
    }
    throw error;
  }
};

// Database utilities
export const clearDatabase = async () => {
  await db.transaction('rw', db.users, async () => {
    await db.users.clear();
    // Clear other tables as needed
  });
};

export const exportData = async () => {
  const data = {
    users: await db.users.toArray(),
    // Export other tables as needed
  };
  return data;
};

export const importData = async (data: {
  users?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  [key: string]: unknown;
}) => {
  await db.transaction('rw', db.users, async () => {
    if (data.users) await db.users.bulkAdd(data.users);
    // Import other tables as needed
  });
};
