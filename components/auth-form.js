"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { auth, signup } from "@/actions/auth-actions";

export default function AuthForm({ formMode }) {
  const [formState, formAction] = useFormState(auth.bind(null, formMode), {});
  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {formState.errors && (
        <ul id="form-errors">
          {Object.keys(formState.errors).map((item) => (
            <li key={item}>{formState.errors[item]}</li>
          ))}
        </ul>
      )}
      <p>
        <button type="submit">
          {formMode === "login" ? "Login" : "Create Accout"}
        </button>
      </p>
      <p>
        {formMode === "login" && (
          <Link href="/?mode=signup">Create an account.</Link>
        )}
        {formMode === "signup" && (
          <Link href="/?mode=login">Login with existing account.</Link>
        )}
      </p>
    </form>
  );
}
