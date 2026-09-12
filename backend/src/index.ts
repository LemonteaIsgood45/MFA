import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { testConnection } from "./db/pool";
import { analyticsRouter } from "./routes/analytics.routes";
import { authRouter } from "./routes/auth.routes";
import { productsRouter } from "./routes/products.routes";
import { servicesRouter } from "./routes/services.routes";
import { usersRouter } from "./routes/users.routes";
import {catalogRouter} from "./routes/catalog.routes";
 
dotenv.config();
 
const app = express();
const port = process.env.PORT ?? 4000;
const allowedOrigins = (process.env.CORS_ORIGIN ?? "").split(",").filter(Boolean);
const allowAll = allowedOrigins.length === 0 || allowedOrigins.includes("*");
 
app.use(cors({ origin: allowAll ? true : allowedOrigins }));
app.use(express.json());
 
app.get("/health", (_req, res) => res.json({ status: "ok" }));
 
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/catalog", catalogRouter);
 
app.listen(port, async () => {
  console.log(`[backend] listening on http://localhost:${port}`);
  try {
    await testConnection();
  } catch (err) {
    console.error("[db] Could not connect to PostgreSQL. Is docker-compose up?", err);
  }
});
 