import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  void req;
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
