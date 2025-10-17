# Luxora Frontend

React + TypeScript + Vite frontend for the Luxora e-commerce application.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible components
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Dropzone** - File upload functionality

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
│   └── auth/           # Authentication pages
├── lib/                # Utility functions and configurations
│   ├── api.ts          # Axios configuration
│   └── utils.ts        # Helper utilities
├── assets/             # Static assets (images, etc.)
└── main.tsx            # Application entry point
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure API endpoint
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 UI Components

This project uses shadcn/ui components with TailwindCSS. Key components include:

- **Authentication Forms** - Login/Register with validation
- **Product Cards** - Responsive product display
- **File Upload** - Drag & drop file upload with validation
- **Navigation** - Role-based navigation
- **Modals & Dialogs** - Accessible modal components

## 🔐 Authentication

The frontend implements secure authentication with:

- **CSRF Protection** - Automatic CSRF token handling
- **Session Management** - Persistent login state
- **Route Protection** - Protected routes based on auth status
- **Role-based UI** - Different interfaces for admin/user

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Breakpoint-based layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🌐 API Integration

Axios is configured with:
- Base URL configuration
- Request/response interceptors
- CSRF token management
- Error handling
- Loading states

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build is optimized with:
- Code splitting
- Tree shaking
- Asset optimization
- Gzip compression

## 🔧 Environment Variables

```bash
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## 📋 ESLint Configuration

For production applications, consider updating the ESLint configuration for type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 🤝 Contributing

When contributing to the frontend:

1. Follow TypeScript best practices
2. Use existing UI components when possible
3. Maintain responsive design principles
4. Add proper error handling
5. Write meaningful commit messages

## 📝 Notes

- This template uses Vite for fast development and building
- Two official plugins are available for React:
  - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Uses Babel for Fast Refresh
  - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - Uses SWC for Fast Refresh
