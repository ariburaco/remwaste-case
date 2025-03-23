# RemWaste Case

A redesigned skip selection page for the WeWantWaste service, created as part of a front-end development challenge.

## Project Overview

This project is a redesign of the skip selection page for WeWantWaste, focusing on improved UI/UX while maintaining all original functionality. The implementation includes:

- Responsive design (mobile and desktop views)
- Modern UI with improved user experience
- Clean and maintainable React code

## Live Demo

You can view the live demo [https://remwaste-case.vercel.app/](#)

## Technologies Used

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query
- **Animations**: Framer Motion

## Features

- Redesigned skip selection interface
- Responsive design for mobile and desktop
- Improved user flow and accessibility
- Data fetched from the WeWantWaste API

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- bun, npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ariburaco/remwaste-case.git
cd remwaste-case

# Install dependencies
bun install
# or
npm install
# or
yarn install
```

### Development

```bash
# Run the development server with Turbopack
bun dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

```bash
# Build the application
bun run build
# or
npm run build
# or
yarn build

# Start the production server
bun run start
# or
npm run start
# or
yarn start
```

## Project Structure

```
remwaste-case/
├── app/           # Next.js application pages
├── components/    # Reusable UI components
├── lib/           # Utility functions and hooks
├── public/        # Static assets
└── styles/        # Global styles
```

## Development Process

This project was fully created with Cursor IDE and Claude AI assistance, showcasing the power of AI-assisted development for modern web applications. (also this Readme file too!)

## Original Requirements

The challenge was to redesign the skip selection page of the WeWantWaste service:

- Maintain all functionality of the original page
- Create a responsive design for mobile and desktop
- Focus on clean, maintainable React code
- Use data from the WeWantWaste API endpoint
