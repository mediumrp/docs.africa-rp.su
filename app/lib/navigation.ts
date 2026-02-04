// app/lib/navigation.ts
import { 
  BookOpen, 
  Code, 
  Settings, 
  FileText,
  Home,
  Gamepad2,
  Shield,
  Coins,
  Car,
  Building2,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: 'Главная',
    href: '/',
    icon: 'Home',
  },
  {
    title: 'Руководства',
    icon: 'BookOpen',
    children: [
      { title: 'Руководство 1', href: '/guides/guide-1' },
      { title: 'Руководство 2', href: '/guides/guide-2' },
    ],
  },
  // Добавь остальные разделы
];

// Функция для поиска категории по пути
export function findCategoryByPath(pathname: string): string | null {
  const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;

  for (const item of navigation) {
    // Проверяем главные пункты
    if (item.href) {
      const normalizedHref = item.href.endsWith('/') && item.href !== '/'
        ? item.href.slice(0, -1)
        : item.href;
      
      if (normalizedHref === normalizedPathname) {
        return item.title;
      }
    }
    
    // Проверяем дочерние пункты
    if (item.children) {
      for (const child of item.children) {
        if (child.href) {
          const normalizedHref = child.href.endsWith('/') && child.href !== '/'
            ? child.href.slice(0, -1)
            : child.href;
          
          if (normalizedHref === normalizedPathname) {
            return item.title; // Возвращаем название родителя
          }
        }
      }
    }
  }
  
  return null;
}