# Fusion Hub - Vue 3 + Vite Application

Fusion Hub is a Vue 3 application built with Vite, designed for creating a hub for all things fusion. This README file provides an overview of the project and instructions on how to set it up and run it.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following tools installed:

- Node.js (version 14 or later)
- npm (Node Package Manager) - This should come with Node.js installation.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>

2. Navigate to the project directory:

   ```bash
   cd fusion-hub

3. Install project dependencies:

   ```bash
   npm install

### Development
To start the development server, use the following command:

```bash
npm run dev -- --host 0.0.0.0
```

This will launch the application in development mode with hot-reloading at http://localhost:3000.


### Building for Production
To build the application for production, use the following command:

```bash
npm run build
```
The production-ready build will be located in the dist directory.

### Preview Production Build
To preview the production build, use the following command:

```bash
npm run preview
```
This will serve the production build for previewing.

### Project Structure
The project structure is organized as follows:

```csharp
fusion-hub/
  ├── src/                  # Source code
  ├── public/               # Public assets
  ├── dist/                 # Production build output
  ├── node_modules/         # Node.js modules
  ├── package.json          # Project configuration
  ├── vite.config.js        # Vite configuration
  └── README.md             # This file
```

### Available Scripts
- npm run dev: Start the development server.
- npm run build: Build the application for production.
- npm run preview: Preview the production build.
- npm run lint: Lint the project using ESLint.
- npm run lint:fix: Lint the project and fix any fixable issues.

### Dependencies
Fusion Hub depends on the following packages:

- Vue 3 and Vue Router for the core of the application.
- Vite for fast development and building.
- Axios for making HTTP requests.
- Pinia for state management.
- FontAwesome for SVG icons.
- Eslint and related packages for code linting.

### Contributing
If you'd like to contribute to Fusion Hub, please follow these guidelines:

- Fork the repository on GitHub.
- Create a new branch from the main branch for your changes.
- Make your changes and commit them with descriptive messages.
- Push your changes to your fork.
- Create a pull request to the main branch of this repository.

## License

This project is licensed under the [Apache License 2.0](LICENSE). See the [LICENSE](LICENSE) file for the full text of the license.

Feel free to reach out to us if you have any questions or issues related to Fusion Hub.

Happy coding! 🚀