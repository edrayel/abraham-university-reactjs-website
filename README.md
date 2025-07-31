# Abraham University Website

A modern, responsive website for Abraham University built with React, Vite, and TailwindCSS. This project showcases the university's programs, campus life, research initiatives, and provides information for prospective students, current students, and alumni.

## Features

- Responsive design for all device sizes
- Fast performance with Vite
- Modern UI components with Radix UI
- Smooth animations with Framer Motion
- Comprehensive university sections (Academics, Admissions, Research, Campus Life, etc.)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/abraham-university-reactjs-website.git

# Navigate to the project directory
cd abraham-university-reactjs-website

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env file with your local configuration
```

## Environment Configuration

Copy `.env.example` to `.env` and configure the following variables:

- `VITE_WP_SITE_URL` - WordPress site URL (e.g., http://localhost:8000)
- `VITE_WP_API_URL` - WordPress REST API URL (e.g., http://localhost:8000/wp-json)
- `VITE_API_BASE_URL` - WordPress REST API v2 URL (e.g., http://localhost:8000/wp-json/wp/v2)
- `VITE_API_KEY` - API key for authentication
- Other configuration options as needed

## Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

The site will be available at http://localhost:5173

## Building for Production

```bash
# Build the project
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
```

## Project Structure

- `/src` - Source files
  - `/components` - Reusable UI components
  - `/pages` - Page components for each route
  - `/lib` - Utility functions
- `/public` - Static assets
- `/plugins` - Custom Vite plugins including visual editor

## Technologies

- React 18
- Vite
- TailwindCSS
- React Router
- Radix UI Components
- Framer Motion

## License

[MIT](LICENSE)