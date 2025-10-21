import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();
const port = process.env.PORT ?? 8000;

app.use(express.json());
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ status: "URL Shortener Service" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
