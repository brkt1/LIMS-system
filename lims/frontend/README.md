# LIMS Frontend

A modern React-based frontend for the Laboratory Information Management System (LIMS), built with TypeScript, Tailwind CSS, and Vite.

## Features

- 🎨 **Modern UI Design** - Clean, responsive interface inspired by modern dashboard designs
- 📊 **Interactive Charts** - Donut charts and bar charts using Recharts
- 📱 **Responsive Layout** - Works on desktop, tablet, and mobile devices
- 🔍 **Search & Filter** - Advanced search and filtering capabilities
- 🎯 **Real-time Data** - Connected to Django REST API backend
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Recharts** - Chart library for React
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Django backend running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Header.tsx      # Top header bar
│   ├── DashboardCards.tsx  # Metric cards
│   ├── ChartsSection.tsx   # Charts and graphs
│   └── RecentDataTable.tsx # Data table
├── services/           # API services
│   └── api.ts         # Axios configuration and API calls
├── App.tsx            # Main app component
├── index.css          # Global styles with Tailwind
└── main.tsx           # App entry point
```

## API Integration

The frontend is configured to work with the Django REST API backend. Key features:

- **Authentication** - JWT token-based authentication
- **Auto-refresh** - Automatic token refresh on expiration
- **Error Handling** - Comprehensive error handling and user feedback
- **Type Safety** - TypeScript interfaces for all API responses

### Available API Endpoints

- **Authentication**: `/api/login/`, `/api/token/refresh/`
- **Test Requests**: `/api/test-requests/`
- **Samples**: `/api/samples/`
- **Equipment**: `/api/equipment/`
- **Inventory**: `/api/inventory/`
- **Analytics**: `/api/analytics/`
- **Notifications**: `/api/notifications/`
- **Support**: `/api/support/`

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary color palette
      }
    }
  }
}
```

### Components

All components are modular and can be easily customized or extended. Each component is self-contained with its own styles and logic.

## Development

### Code Style

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Adding New Features

1. Create new components in the `components/` directory
2. Add API calls in `services/api.ts`
3. Update the main `App.tsx` to include new components
4. Style with Tailwind CSS classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the LIMS system and follows the same licensing terms.