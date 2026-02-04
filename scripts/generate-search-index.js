// scripts/generate-search-index.js
const fs = require('fs');
const path = require('path');

function extractTextFromMDX(content) {
  // Убираем импорты и экспорты
  content = content.replace(/^import\s+.*$/gm, '');
  content = content.replace(/^export\s+.*$/gm, '');
  
  // Убираем JSX компоненты
  content = content.replace(/<[^>]+>/g, ' ');
  
  // Убираем код блоки
  content = content.replace(/```[\s\S]*?```/g, ' ');
  content = content.replace(/`[^`]+`/g, ' ');
  
  // Убираем markdown синтаксис
  content = content.replace(/#{1,6}\s+/g, ' ');
  content = content.replace(/\*\*([^*]+)\*\*/g, '$1');
  content = content.replace(/\*([^*]+)\*/g, '$1');
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  
  // Убираем лишние пробелы
  content = content.replace(/\s+/g, ' ').trim();
  
  return content;
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function extractHeadings(content) {
  const headings = [];
  const regex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      id: match[2].toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    });
  }
  
  return headings;
}

// Автоматическое определение категории из пути
function getCategoryFromPath(filePath) {
  const parts = filePath.split(path.sep).filter(Boolean);
  
  // Убираем 'app' из начала если есть
  if (parts[0] === 'app') {
    parts.shift();
  }
  
  // Если это корневая страница
  if (parts.length === 0 || (parts.length === 1 && parts[0].match(/page\.(mdx|md)$/))) {
    return 'Главная';
  }
  
  // Берём первую папку как категорию
  const categoryFolder = parts[0];
  
  // Если это 'docs', берём следующий уровень
  if (categoryFolder === 'docs' && parts.length > 1) {
    // Преобразуем имя папки в читаемый формат
    return formatCategoryName(parts[1]);
  }
  
  return formatCategoryName(categoryFolder);
}

// Преобразование имени папки в читаемый формат
function formatCategoryName(name) {
  // Убираем расширение если есть
  name = name.replace(/\.(mdx|md)$/, '');
  
  // Заменяем дефисы и подчёркивания на пробелы
  name = name.replace(/[-_]/g, ' ');
  
  // Делаем первую букву заглавной
  name = name.charAt(0).toUpperCase() + name.slice(1);
  
  return name;
}

function scanDirectory(dir, basePath = '', results = []) {
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Пропускаем служебные папки
      if (['components', 'context', 'fonts', 'images', 'api'].includes(item) && basePath === '') {
        continue;
      }
      scanDirectory(fullPath, relativePath, results);
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const title = extractTitle(content);
      
      // Пропускаем файлы без заголовка
      if (!title) continue;
      
      const text = extractTextFromMDX(content);
      const headings = extractHeadings(content);
      
      // Определяем URL
      let href;
      if (item === 'page.mdx' || item === 'page.md') {
        href = '/' + basePath.replace(/\\/g, '/');
      } else {
        href = '/' + relativePath.replace(/\\/g, '/').replace(/\.(mdx|md)$/, '');
      }
      
      // Убираем trailing slash кроме корня
      if (href !== '/' && href.endsWith('/')) {
        href = href.slice(0, -1);
      }
      
      // Автоматически определяем категорию
      const category = getCategoryFromPath(relativePath);
      
      results.push({
        title,
        href,
        category,
        content: text.slice(0, 500),
        headings,
      });
    }
  }
  
  return results;
}

// Запуск
const appDir = path.join(process.cwd(), 'app');
const searchIndex = scanDirectory(appDir);

// Сохраняем индекс
const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));

console.log(`✅ Search index: ${searchIndex.length} pages indexed`);
searchIndex.forEach(p => console.log(`   - ${p.category}: ${p.title}`));