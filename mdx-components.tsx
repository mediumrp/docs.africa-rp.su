// mdx-components.tsx
import type { MDXComponents } from 'mdx/types';
import { 
  Info, 
  Lightbulb, 
  AlertTriangle, 
  AlertOctagon, 
  FileText,
  CheckCircle
} from 'lucide-react';
import { Expandable } from './app/components/Expandable';

// ==================== TOOLTIP ====================

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="relative inline-block group">
      <span className="border-b-2 border-dashed border-purple-400 dark:border-purple-500 text-purple-700 dark:text-purple-300 cursor-help transition-colors hover:border-purple-600 dark:hover:border-purple-400 hover:text-purple-900 dark:hover:text-purple-200">
        {children}
      </span>
      
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-max max-w-[280px] text-center break-words">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
      </span>
    </span>
  );
}

// ==================== CALLOUT ====================

type CalloutType = 'info' | 'note' | 'tip' | 'warning' | 'danger' | 'success';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutConfig = {
  info: {
    icon: Info,
    title: 'Информация',
    containerClass: 'bg-blue-200 dark:bg-blue-900/60 border-l-4 border-blue-600 dark:border-blue-400',
    iconClass: 'text-blue-700 dark:text-blue-300',
    titleClass: 'text-blue-950 dark:text-blue-100',
    textClass: 'text-blue-900 dark:text-blue-200',
  },
  note: {
    icon: FileText,
    title: 'Заметка',
    containerClass: 'bg-slate-200 dark:bg-slate-800 border-l-4 border-slate-600 dark:border-slate-400',
    iconClass: 'text-slate-700 dark:text-slate-300',
    titleClass: 'text-slate-950 dark:text-slate-100',
    textClass: 'text-slate-900 dark:text-slate-200',
  },
  tip: {
    icon: Lightbulb,
    title: 'Совет',
    containerClass: 'bg-green-200 dark:bg-green-900/60 border-l-4 border-green-600 dark:border-green-400',
    iconClass: 'text-green-700 dark:text-green-300',
    titleClass: 'text-green-950 dark:text-green-100',
    textClass: 'text-green-900 dark:text-green-200',
  },
  warning: {
    icon: AlertTriangle,
    title: 'Внимание',
    containerClass: 'bg-orange-200 dark:bg-orange-900/60 border-l-4 border-orange-600 dark:border-orange-400',
    iconClass: 'text-orange-700 dark:text-orange-300',
    titleClass: 'text-orange-950 dark:text-orange-100',
    textClass: 'text-orange-900 dark:text-orange-200',
  },
  danger: {
    icon: AlertOctagon,
    title: 'Опасность',
    containerClass: 'bg-red-200 dark:bg-red-900/60 border-l-4 border-red-600 dark:border-red-400',
    iconClass: 'text-red-700 dark:text-red-300',
    titleClass: 'text-red-950 dark:text-red-100',
    textClass: 'text-red-900 dark:text-red-200',
  },
  success: {
    icon: CheckCircle,
    title: 'Успех',
    containerClass: 'bg-emerald-200 dark:bg-emerald-900/60 border-l-4 border-emerald-600 dark:border-emerald-400',
    iconClass: 'text-emerald-700 dark:text-emerald-300',
    titleClass: 'text-emerald-950 dark:text-emerald-100',
    textClass: 'text-emerald-900 dark:text-emerald-200',
  },
};

function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.title;

  return (
    <div className={`my-6 rounded-lg p-4 ${config.containerClass}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconClass}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-bold mb-1 ${config.titleClass}`}>
            {displayTitle}
          </p>
          <div className={`text-sm leading-relaxed ${config.textClass}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SLUGIFY ====================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ==================== HEADINGS ====================

function Heading1({ children }: { children?: React.ReactNode }) {
  const id = slugify(String(children));
  return (
    <h1 id={id} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 sm:mb-8 mt-6 sm:mt-8 first:mt-0 scroll-mt-20 leading-tight hyphens-auto">
      {children}
    </h1>
  );
}

function Heading2({ children }: { children?: React.ReactNode }) {
  const id = slugify(String(children));
  return (
    <h2 id={id} className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 mt-8 sm:mt-12 pb-2 border-b border-gray-200 dark:border-gray-700 scroll-mt-20 hyphens-auto">
      {children}
    </h2>
  );
}

function Heading3({ children }: { children?: React.ReactNode }) {
  const id = slugify(String(children));
  return (
    <h3 id={id} className="text-xl sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 mt-6 sm:mt-8 scroll-mt-20 hyphens-auto">
      {children}
    </h3>
  );
}

function Heading4({ children }: { children?: React.ReactNode }) {
  const id = slugify(String(children));
  return (
    <h4 id={id} className="text-lg sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4 sm:mt-6 scroll-mt-20 hyphens-auto">
      {children}
    </h4>
  );
}

// ==================== TEXT ====================

function Paragraph({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-7 break-words whitespace-pre-line text-base">
      {children}
    </p>
  );
}

function Anchor({ href, children }: { href?: string; children?: React.ReactNode }) {
  const isExternal = href?.startsWith('http');
  return (
    <a 
      href={href} 
      className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

function Strong({ children }: { children?: React.ReactNode }) {
  return <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>;
}

function Emphasis({ children }: { children?: React.ReactNode }) {
  return <em className="italic">{children}</em>;
}

// ==================== LISTS ====================

function UnorderedList({ children }: { children?: React.ReactNode }) {
  return <ul className="list-disc mb-4 space-y-2 text-gray-700 dark:text-gray-300 pl-6">{children}</ul>;
}

function OrderedList({ children }: { children?: React.ReactNode }) {
  return <ol className="list-decimal mb-4 space-y-2 text-gray-700 dark:text-gray-300 pl-6">{children}</ol>;
}

function ListItem({ children }: { children?: React.ReactNode }) {
  return <li className="text-gray-700 dark:text-gray-300 break-words">{children}</li>;
}

// ==================== CODE ====================

function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded text-sm font-mono break-all">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children?: React.ReactNode }) {
  return (
    <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm max-w-full">
      {children}
    </pre>
  );
}

// ==================== OTHER ====================

function Quote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg text-gray-700 dark:text-gray-300 break-words">
      {children}
    </div>
  );
}

function HorizontalRule() {
  return <hr className="my-8 border-gray-200 dark:border-gray-700" />;
}

// ==================== TABLE ====================

function Table({ children }: { children?: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-6 max-w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 shadow-lg shadow-slate-200 dark:shadow-slate-950/50">
      <table className="min-w-full">
        {children}
      </table>
    </div>
  );
}

function TableHead({ children }: { children?: React.ReactNode }) {
  return <thead className="bg-slate-200 dark:bg-slate-800 border-b-2 border-slate-400 dark:border-slate-600">{children}</thead>;
}

function TableBody({ children }: { children?: React.ReactNode }) {
  return <tbody className="bg-slate-50 dark:bg-slate-900">{children}</tbody>;
}

function TableRow({ children }: { children?: React.ReactNode }) {
  return <tr className="border-b-2 border-slate-300 dark:border-slate-700 last:border-b-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{children}</tr>;
}

function TableHeader({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 break-words border-r-2 border-slate-400 dark:border-slate-600 last:border-r-0">{children}</th>;
}

function TableCell({ children }: { children?: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200 break-words border-r-2 border-slate-300 dark:border-slate-700 last:border-r-0">{children}</td>;
}

// ==================== EXPORT ====================

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    p: Paragraph,
    a: Anchor,
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
    code: InlineCode,
    pre: CodeBlock,
    blockquote: Quote,
    hr: HorizontalRule,
    table: Table,
    thead: TableHead,
    tbody: TableBody,
    tr: TableRow,
    th: TableHeader,
    td: TableCell,
    strong: Strong,
    em: Emphasis,
    Callout,
    Tooltip,
    Expandable,
    ...components,
  };
}