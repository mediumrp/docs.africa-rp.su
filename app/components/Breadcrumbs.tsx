// app/components/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import { findCategoryByPath } from '../lib/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Главная - не показываем
  if (pathname === '/') {
    return null;
  }

  const category = findCategoryByPath(pathname);

  if (!category) {
    return null;
  }

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      {category}
    </div>
  );
}