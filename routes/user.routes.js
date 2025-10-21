import express from "express";
import db from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import {
  createUserSchema,
  loginUserSchema,
} from "../validations/request.validation.js";
import { hashPassword } from "../utils/hash.js";
import { findUserByEmail } from "../services/user.service.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = await createUserSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { firstName, lastName, email, password } = validationResult.data;

  // check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // create hash of password with salt
  const { salt, hashedPassword } = hashPassword(password);

  // insert user into database
  const [user] = await db
    .insert(usersTable)
    .values({ firstName, lastName, email, salt, password: hashedPassword })
    .returning({ id: usersTable.id });

  // return user
  res.status(201).json({
    message: "User created successfully",
    user,
  });
});

router.post("/login", async (req, res) => {
  const validationResult = await loginUserSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;

  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    return res
      .status(400)
      .json({ error: `User wiht email ${email} does not exist` });
  }

  const { hashedPassword } = hashPassword(password, existingUser.salt);

  if (hashedPassword !== existingUser.password) {
    return res.status(400).json({ error: "Invalid password" });
  }

  // generate jwt token
  const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET);

  // return token
  res.status(200).json({ message: "Login successful", token });
});
export default router;
