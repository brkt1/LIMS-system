# Dark Mode Implementation Guide

## Overview

The LIMS application now supports both light and dark themes. The theme system is built using React Context and Tailwind CSS with the `dark:` prefix.

## How to Use

### 1. Theme Toggle

The theme toggle button is automatically included in the header. Users can click it to switch between light and dark modes.

### 2. Theme Context

```tsx
import { useTheme } from "../contexts/ThemeContext";

const MyComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### 3. Adding Dark Mode to Components

#### Basic Pattern

Replace light-only classes with responsive dark mode classes:

```tsx
// Before
<div className="bg-white text-gray-900 border-gray-200">

// After
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
```

#### Common Patterns

**Backgrounds:**

- `bg-white` → `bg-white dark:bg-gray-800`
- `bg-gray-50` → `bg-gray-50 dark:bg-gray-900`
- `bg-gray-100` → `bg-gray-100 dark:bg-gray-700`

**Text Colors:**

- `text-gray-900` → `text-gray-900 dark:text-white`
- `text-gray-600` → `text-gray-600 dark:text-gray-300`
- `text-gray-500` → `text-gray-500 dark:text-gray-400`

**Borders:**

- `border-gray-200` → `border-gray-200 dark:border-gray-700`
- `border-gray-300` → `border-gray-300 dark:border-gray-600`

**Interactive Elements:**

- `hover:bg-gray-100` → `hover:bg-gray-100 dark:hover:bg-gray-700`
- `focus:ring-primary-500` → `focus:ring-primary-500 dark:focus:ring-primary-400`

#### Form Elements

```tsx
<input className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400" />
```

#### Cards and Containers

```tsx
<div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
  <h3 className="text-gray-900 dark:text-white">Title</h3>
  <p className="text-gray-600 dark:text-gray-300">Description</p>
</div>
```

#### Tables

```tsx
<table className="bg-white dark:bg-gray-800">
  <thead className="bg-gray-50 dark:bg-gray-700">
    <tr>
      <th className="text-gray-900 dark:text-white">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-gray-200 dark:border-gray-700">
      <td className="text-gray-900 dark:text-white">Data</td>
    </tr>
  </tbody>
</table>
```

## Implementation Status

### ✅ Completed

- Theme Context and Provider
- Theme Toggle Component
- Header Component
- Login Component
- Sidebar Component
- App Layout
- Tailwind Configuration

### 🔄 In Progress

- Individual Dashboard Components (UserManagement example started)

### 📋 To Do

- Update all dashboard components with dark mode classes
- Test theme persistence across browser sessions
- Add theme transition animations
- Update charts and graphs for dark mode
- Test accessibility in both themes

## Best Practices

1. **Always pair light and dark classes**: Don't leave components with only light mode styling
2. **Use semantic color names**: Prefer `text-gray-900 dark:text-white` over specific color values
3. **Test both themes**: Always verify components look good in both light and dark modes
4. **Consider contrast**: Ensure text remains readable in both themes
5. **Use consistent patterns**: Follow the established patterns for similar components

## Testing

1. Toggle between light and dark modes using the header button
2. Refresh the page to ensure theme persistence
3. Test on different screen sizes
4. Verify all interactive elements work in both themes
5. Check that charts and graphs are visible in dark mode

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

The theme system automatically detects the user's system preference on first visit and remembers their choice for future visits.
