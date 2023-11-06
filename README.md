# CI-CD-Fusion-Hub - Vue 3 + Vite Application

CI-CD-Fusion-Hub is a Vue 3 application built with Vite that serves as a platform for connecting and managing multiple CI/CD platforms, including GitLab, GitHub, and Jenkins. This application empowers users to view and manage pipelines within a unified interface. Users can initiate, halt, and control pipelines, and administrators can enforce access restrictions to determine which users can access specific pipelines.

CI-CD-Fusion-Hub offers cost-saving benefits by streamlining CI/CD pipeline management. For example, GitLab Enterprise users can reduce their costs per user by utilizing this application's efficient pipeline control and access management features.

This README file provides detailed information about the project, including how to set it up and run it, project structure, available scripts, dependencies, and how to contribute to the development of the application.


## Table of Contents

- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
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

## Environment Configuration

By following these steps, you can configure the backend URL for your application. Make sure not to share sensitive information in your `.env` file, and keep it secure.

1. Duplicate the `.env-template` file in the project root directory.

2. Rename the duplicated file to `.env`.

3. Open the `.env` file and set the `VITE_backendUrl` variable to your actual backend API URL. For example: `VITE_backendUrl=https://localhost:8111/api/v1`

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