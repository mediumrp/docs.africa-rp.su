// app/components/MobileTOC.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { List, X, ChevronUp } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function MobileTOC() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.mdx-content h1, .mdx-content h2, .mdx-content h3');
      
      const items: TOCItem[] = Array.from(elements).map((element, index) => {
        if (!element.id) {
          element.id = `heading-${index}`;
        }
        
        return {
          id: element.id,
          text: element.textContent || '',
          level: parseInt(element.tagName[1]),
        };
      });

      setHeadings(items);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={() => setIsOpen(true)}
        className="xl:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Открыть оглавление"
      >
        <List className="w-6 h-6" />
      </button>

      {/* Оверлей */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Панель TOC */}
      <div
        className={`xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        {/* Шапка */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <List className="w-4 h-4" />
            <span>На этой странице</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Список */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(70vh - 60px)' }}>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => handleClick(heading.id)}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                    ${heading.level === 1 ? 'font-semibold text-base' : ''}
                    ${heading.level === 2 ? 'font-medium text-sm' : ''}
                    ${heading.level === 3 ? 'text-sm pl-6 text-gray-500 dark:text-gray-400' : ''}
                  `}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>

          {/* Кнопка наверх */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsOpen(false);
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            Наверх
          </button>
        </div>
      </div>
    </>
  );
}