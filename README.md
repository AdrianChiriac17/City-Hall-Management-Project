# City Hall Management Project

This is a full-stack application for managing City Hall operations.

## Architecture

The project is structured as a monorepo containing:
- **`frontend/`**: An Angular 21 Single Page Application (SPA).
- **`backend/`**: A .NET 10 ASP.NET Core Web API using Entity Framework Core.

## Prerequisites

- [Node.js](https://nodejs.org/) (for the Angular frontend)
- [.NET 10 SDK](https://dotnet.microsoft.com/) (for the C# backend)

## Getting Started

### Using VS Code (Recommended)
This workspace comes with a pre-configured VS Code launch setup.
1. Open the root folder (`City-Hall-Management-Project`) in VS Code.
2. Go to the **Run and Debug** panel (`Ctrl+Shift+D`).
3. Select **Full Stack Run (frontend + backend)** from the dropdown.
4. Press the green Play button or `F5`.

This will automatically:
- Install npm packages if needed.
- Start the .NET backend API on `http://localhost:5009`.
- Start the Angular development server on `http://localhost:4200`.
- Open both in your browser.

### Manual Startup (Terminal)

**To run the Backend:**
```bash
cd backend
dotnet run
```

**To run the Frontend:**
```bash
cd frontend
npm install
npm start
```

## Technologies Used
- Frontend: Angular, TypeScript, SCSS, RxJS
- Backend: C#, .NET 10, ASP.NET Core API, Entity Framework Core (In-Memory DB for now)