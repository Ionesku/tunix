# CDE Desktop Environment - Web Simulator

Аутентичная реконструкция Unix CDE (Common Desktop Environment) с эстетикой Motif 90-х годов.

## 🎯 Особенности

### Архитектура
- **Модульная структура**: Разделение на отдельные JavaScript-модули
- **GUI-фреймворк**: Библиотека готовых Motif-компонентов
- **Система контекстных меню**: Полноценные меню по правому клику
- **Виртуальная ФС**: Unix-подобная файловая система

### Технические характеристики
- **Базовое разрешение**: 800×600 пикселей
- **Масштабирование**: Кратное увеличение (×1, ×2, ×3) с пиксельным рендерингом
- **Нет зависимостей**: Чистый HTML/CSS/JS без библиотек
- **Модульная архитектура**: Разделение по компонентам и приложениям

### Визуальная аутентичность
- **Стиль Motif**: 3D-скосы, толстые рамки окон (5px)
- **Палитра CDE**: 
  - База: `#BDBDBD`
  - Светлая грань: `#FFFFFF`
  - Тёмная грань: `#7F7F7F`
  - Акцент: `#3A3A6A` / `#000080`
- **Иконки**: 16-цветные XPM-стайл (data URI PNG)
- **Шрифты**: Lucida Sans/Console без сглаживания

### CRT-режим (опционально)
- Скан-линии (регулируемая интенсивность 0-100%)
- Лёгкая бочкообразная дисторсия (0-100%)
- Случайный джиттер (1px сдвиг каждые 0.5-2 сек)
- Виньетирование

### Front Panel
- Кнопка меню приложений (левая часть)
- Лаунчеры быстрого доступа (Terminal, Files, Editor, Calculator)
- Переключатель рабочих мест (4 виртуальных десктопа)
- Панель задач (открытые окна)
- Часы в формате HH:MM

## 📁 Структура проекта

```
Project/
├── index.html              # Главная страница
├── style.css               # Стили CDE/Motif
├── README.md               # Документация
└── js/                     # JavaScript модули
    ├── main.js             # Инициализация системы
    ├── window-manager.js   # Управление окнами
    ├── gui-components.js   # Библиотека GUI-компонентов
    ├── context-menu.js     # Контекстные меню
    ├── filesystem.js       # Виртуальная ФС
    └── apps/               # Приложения
        ├── terminal.js     # Терминал (dtterm)
        ├── editor.js       # Текстовый редактор (dtpad)
        ├── files.js        # Файловый менеджер (dtfile)
        ├── calculator.js   # Калькулятор (dtcalc)
        ├── clock.js        # Часы (dtclock)
        └── about.js        # О системе
```

## 🚀 Приложения

### Terminal (dtterm)
Эмулятор терминала с поддержкой команд:
- `ls`, `cd`, `pwd` - навигация по файловой системе
- `cat`, `echo` - работа с текстом
- `mkdir`, `touch` - создание файлов/папок
- `rm` - удаление файлов
- `clear`, `date`, `whoami`, `uname`, `env` - утилиты

### Text Editor (dtpad)
Полноценный текстовый редактор с:
- Меню File/Edit/Help
- Открытие/сохранение файлов
- Отслеживание изменений
- Сочетания клавиш

### File Manager (dtfile)
Файловый менеджер с:
- Навигацией по виртуальной ФС
- Toolbar с кнопками Back/Home/Refresh
- Создание файлов/папок
- Контекстные меню для файлов
- Открытие файлов в редакторе

### Calculator (dtcalc)
Калькулятор с:
- Базовыми операциями (+, -, *, /)
- Функциями памяти (MC, MR, M+, M-)
- Квадратным корнем (√)
- Поддержкой клавиатуры

### Clock (dtclock)
Часы с отображением:
- Текущего времени (чч:мм:сс)
- Даты
- Дня недели

### About System
Информация о системе

## ⌨️ Горячие клавиши

### Приложения
- `Ctrl+Alt+T` - Открыть терминал
- `Ctrl+Alt+E` - Открыть текстовый редактор
- `Ctrl+Alt+F` - Открыть файловый менеджер
- `Ctrl+Alt+S` - Настройки отображения

### Управление окнами
- `Alt+F4` - Закрыть активное окно
- `Escape` - Закрыть панель настроек

### Прочее
- `Правая кнопка мыши` - Контекстное меню

## 🖱️ Контекстные меню

### Рабочий стол
- Создание новых файлов/папок
- Обновление рабочего стола
- Настройки дисплея
- О системе

### Иконки приложений
- Открыть приложение
- Свойства

### Файлы (в File Manager)
- Открыть/Редактировать
- Удалить
- (больше опций будут добавлены)

### Окна (системное меню)
- Restore, Move, Size
- Minimize, Maximize
- Close

## ⚙️ Настройки отображения

Доступны через `Ctrl+Alt+S` или меню Front Panel:

- **Scale**: Масштаб интерфейса (1x, 2x, 3x)
- **CRT Mode**: Включение/выключение CRT-эффектов
- **Scanlines**: Интенсивность скан-линий (0-100%)
- **Distortion**: Степень дисторсии (0-100%)
- **Focus Follows Mouse**: Фокус следует за мышью (как в Unix)

## 🪟 Управление окнами

### Заголовок окна
- **Системное меню** (квадрат слева):
  - Одиночный клик - открыть меню
  - Двойной клик - закрыть окно
- **Перетаскивание** - переместить окно
- **Кнопки**: Minimize (_), Maximize (□), Close (X)

### Изменение размера
- Потянуть за угол в правом нижнем углу окна

### Фокус
- Клик по окну для активации
- Опционально: фокус следует за мышью
- Активное окно выделяется синим заголовком

## 🖼️ Иконки рабочего стола

- **Двойной клик** - запустить приложение
- **Одиночный клик** - выбрать иконку
- **Ctrl+Click** - множественное выделение
- **Правый клик** - контекстное меню

## 📂 Виртуальная файловая система

Базовая структура директорий:
```
/
├── home/
│   └── user/
│       ├── documents/
│       │   ├── readme.txt
│       │   └── notes.txt
│       └── downloads/
├── usr/
│   ├── bin/
│   ├── lib/
│   └── share/doc/
├── etc/
│   ├── hosts
│   └── passwd
├── tmp/
└── var/log/
```

## 🛠️ GUI-фреймворк

Библиотека `GUI` предоставляет готовые компоненты:

### Создание элементов
```javascript
GUI.createButton(label, onClick)
GUI.createDefaultButton(label, onClick)
GUI.createInput(value, placeholder)
GUI.createTextarea(value, rows)
GUI.createPanel()
GUI.createToolbar()
GUI.createList()
GUI.createListItem(text, onClick)
GUI.createMenuBar()
GUI.createMenuItem(label, items)
GUI.createStatusBar(text)
GUI.createLabel(text)
GUI.createCheckbox(label, checked, onChange)
```

### Диалоги
```javascript
GUI.alert(title, message)
GUI.confirm(title, message, onConfirm, onCancel)
GUI.prompt(title, message, defaultValue, onSubmit)
```

## 🔧 Технические детали

### Пиксельный рендеринг
```css
image-rendering: pixelated;
image-rendering: -moz-crisp-edges;
image-rendering: crisp-edges;
```

### Отключение сглаживания шрифтов
```css
-webkit-font-smoothing: none;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeSpeed;
font-smooth: never;
```

### Motif 3D-скосы
- Верх/лево: светлая грань (`#FFFFFF`)
- Низ/право: тёмная грань (`#7F7F7F`)
- Вдавленные элементы: инверсия граней

## 🌐 Запуск

Просто откройте `index.html` в браузере. Рекомендуется:
- Современный браузер (Chrome, Firefox, Edge)
- Разрешение экрана минимум 1600×1200 для масштаба ×2
- JavaScript включён

## ✅ Совместимость

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (с ограничениями в CRT-эффектах)
- ❌ Internet Explorer (не поддерживается)

## 📚 API для разработчиков

### Создание приложения

```javascript
const MyApp = {
  name: 'My Application',
  icon: 'data:image/png;base64,...',
  
  launch() {
    wm.createWindow('My App', 400, 300, (content, windowId) => {
      // Создайте UI здесь
      const button = GUI.createButton('Click me', () => {
        GUI.alert('Hello', 'Button clicked!');
      });
      content.appendChild(button);
    });
  }
};

// Зарегистрируйте в Apps
Apps.myapp = MyApp;
```

### Window Manager API

```javascript
// Создание окна
wm.createWindow(title, width, height, contentBuilder, options)

// Управление окнами
wm.focusWindow(windowId)
wm.closeWindow(windowId)
wm.minimizeWindow(windowId)
wm.restoreWindow(windowId)
wm.maximizeWindow(windowId)

// Настройки
wm.setFocusFollowsMouse(enabled)
```

### Context Menu API

```javascript
contextMenu.show(items, x, y)
contextMenu.hide()

// Пример items:
[
  { label: 'Open', action: () => {} },
  { separator: true },
  { label: 'Disabled', disabled: true },
  { label: 'Delete', action: () => {} }
]
```

### Virtual Filesystem API

```javascript
vfs.getCurrentPath()
vfs.changeDirectory(path)
vfs.listDirectory(path)
vfs.readFile(path)
vfs.writeFile(path, content)
vfs.createDirectory(path)
vfs.deleteFile(path)
```

## 🎨 Философия дизайна

Проект стремится воссоздать аутентичный опыт работы с Unix-станциями 90-х:
- Никаких градиентов, теней, скруглений
- Строгая геометрия и промышленная палитра
- Плотная типографика без сглаживания
- 3D-эффекты через цветовые скосы
- Минималистичные иконки (16 цветов)
- Контекстные меню - основной способ взаимодействия

## 📜 История

CDE (Common Desktop Environment) был стандартным окружением рабочего стола для коммерческих Unix-систем в 1990-х годах (Solaris, HP-UX, AIX, др.). Основан на библиотеке Motif и оконном менеджере dtwm.

Этот проект воссоздаёт внешний вид и ощущение CDE с современными веб-технологиями, сохраняя аутентичность оригинала.

---

**Примечание**: Это учебный/ностальгический проект. Виртуальная файловая система существует только в памяти браузера и сбрасывается при перезагрузке страницы.

**Лицензия**: MIT (см. отдельный файл LICENSE при необходимости)

**Автор**: Ретро-десктоп проект, 2025
