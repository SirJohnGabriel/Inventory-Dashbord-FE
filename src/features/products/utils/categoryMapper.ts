import { useAppStore } from '@shared/store';

/**
 * Maps a category ID to its corresponding category name.
 * @param categoryId - The category ID to map
 * @returns The category name if found, otherwise the original ID
 */
export function getCategoryName(categoryId: string): string {
  const { lookups } = useAppStore.getState();

  if (!lookups?.Categories) {
    return categoryId;
  }

  const category = lookups.Categories.find((cat) => cat.key === categoryId);
  return category?.value || categoryId;
}
