import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Node.js compatibility for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // Try multiple possible paths for the dist directory
  const possiblePaths = [
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public")
  ];

  let distPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      distPath = p;
      break;
    }
  }

  if (!distPath) {
    console.error("Tried paths:", possiblePaths);
    throw new Error(
      `Could not find the build directory, make sure to build the client first`,
    );
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // Health check endpoints for Railway
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV 
    });
  });

  // Additional Railway health check endpoints
  app.get("/", (_req, res) => {
    try {
      res.sendFile(path.resolve(distPath!, "index.html"));
    } catch (error) {
      console.error("Error serving index.html:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Keep alive endpoint
  app.get("/ping", (_req, res) => {
    res.status(200).send("pong");
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    try {
      res.sendFile(path.resolve(distPath!, "index.html"));
    } catch (error) {
      console.error("Error serving index.html:", error);
      res.status(500).send("Internal Server Error");
    }
  });
}