import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { serveStatic as serveStaticProduction, log as logProduction } from "./production";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      // Use production-compatible log function in production
      const logFunc = app.get("env") === "development" ? log : logProduction;
      logFunc(logLine);
    }
  });

  next();
});

// Process signal handlers for graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Use production-compatible static server
    serveStaticProduction(app);
  }

  // Use Railway's PORT environment variable in production, fallback to 5000 for local development
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";
  
  server.listen(port, host, () => {
    const logFunc = app.get("env") === "development" ? log : logProduction;
    logFunc(`serving on port ${port}`);
    
    // Log environment info in production
    if (app.get("env") === "production") {
      logFunc(`Environment: ${process.env.NODE_ENV}`);
      logFunc(`Host: ${host}`);
      logFunc(`Working directory: ${process.cwd()}`);
    }
  }).on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
})();
