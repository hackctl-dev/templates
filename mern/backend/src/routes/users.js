import { Router } from "express";
import { User } from "../models/User.js";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  res.json({ users });
});

router.post("/", async (req, res) => {
  const { name, email } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  try {
    const user = await User.create({ name, email });
    return res.status(201).json({ user });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "email already exists" });
    }
    return res.status(500).json({ error: "failed to create user" });
  }
});

export default router;
