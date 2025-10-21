import db from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email) => {
  const [user] = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return user;
};
