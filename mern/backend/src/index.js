import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDatabase } from "./config/db.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/users", usersRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

async function main() {
  await connectToDatabase(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`[backend] listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error("[backend] startup failed", error);
  process.exit(1);
});
