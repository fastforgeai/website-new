# FastForge

AI native services for manufacturing companies.

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd website-new
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the app for production to the `dist` folder.
- `npm run preview` - Boots up a local web server to preview the production build.
- `npm run lint` - Runs ESLint to check for code quality and formatting issues.

## 🏗️ Project Structure

```text
├── public/             # Static assets that are not processed by Webpack/Vite
├── src/                # Application source code
│   ├── assets/         # Images, fonts, and other media
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   ├── index.css       # Global styles and Tailwind directives
│   └── ...             # Other React components (e.g., AnimatedButton, Switch)
├── index.html          # HTML entry point
├── package.json        # Project metadata and dependencies
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## 📄 License

This project is private and proprietary.
