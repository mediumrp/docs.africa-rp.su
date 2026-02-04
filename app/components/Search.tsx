// app/components/Search.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X, FileText, Hash } from 'lucide-react';
import Fuse from 'fuse.js';

interface SearchItem {
  title: string;
  href: string;
  category: string;
  content: string;
  headings: { level: number; text: string; id: string }[];
}

interface ResultItem {
  title: string;
  href: string;
  category: string;
  isHeading: boolean;
  parentTitle?: string;
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [selected, setSelected] = useState(0);
  const [fuse, setFuse] = useState<Fuse<ResultItem> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/search-index.json')
      .then(r => r.json())
      .then((data: SearchItem[]) => {
        const items: ResultItem[] = [];
        data.forEach(page => {
          items.push({
            title: page.title,
            href: page.href,
            category: page.category,
            isHeading: false,
          });
          page.headings.forEach(h => {
            if (h.level > 1) {
              items.push({
                title: h.text,
                href: page.href + '#' + h.id,
                category: page.category,
                isHeading: true,
                parentTitle: page.title,
              });
            }
          });
        });
        setFuse(new Fuse(items, {
          keys: ['title', 'category', 'parentTitle'],
          threshold: 0.3,
        }));
      });
  }, []);

  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }
    setResults(fuse.search(query).slice(0, 8).map(r => r.item));
    setSelected(0);
  }, [query, fuse]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && results[selected]) {
      go(results[selected].href);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-400 dark:border-gray-600 overflow-hidden">
          
          {/* Input */}
          <div className="flex items-center gap-3 p-4 border-b-2 border-gray-200 dark:border-gray-700">
            <SearchIcon className="w-6 h-6 text-blue-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Поиск..."
              className="flex-1 bg-transparent outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((item, i) => (
                  <button
                    key={item.href + i}
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      selected === i
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      {item.isHeading ? (
                        <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {item.category}
                        {item.parentTitle && (
                          <span className="text-gray-400 dark:text-gray-500"> › {item.parentTitle}</span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {item.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                Ничего не найдено
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                Введите запрос
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-6 p-3 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
            <span>↑↓ выбор</span>
            <span>↵ открыть</span>
            <span>esc закрыть</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Search() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-11 px-4 rounded-full border-2 border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <SearchIcon className="w-4 h-4" />
        <span>Поиск</span>
        <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 text-[10px] rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
          Ctrl+K
        </kbd>
      </button>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}