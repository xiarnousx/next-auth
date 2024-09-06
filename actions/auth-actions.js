"use server";

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(state, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {};
  if (!email.includes("@")) {
    errors["email"] = "Please enter a valid email";
  }

  if (password.trim().length < 8) {
    errors["password"] = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  // store in db
  const hashedPassword = hashUserPassword(password);
  try {
    const userId = createUser(email, hashedPassword);
    createAuthSession(userId);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "It seems an email already exists",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const user = getUserByEmail(email);

  if (!user) {
    return { errors: { email: "Invalid credentials" } };
  }

  const isValidPassword = verifyPassword(user.password, password);
  if (!isValidPassword) {
    return { errors: { email: "Invalid credentials" } };
  }

  createAuthSession(user.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  } else {
    return signup(prevState, formData);
  }
}

export async function logout() {
  await destroySession();
  redirect("/");
}
