"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { createSession, deleteSession } from "./session";

export type LoginState = {
  error?: string;
  success?: boolean;
} | null;

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string) || "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email atau password tidak valid." };
    }

    // Check if user is ADMIN
    if (user.role !== "ADMIN") {
      return { error: "Akses ditolak. Hanya admin yang diizinkan." };
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Email atau password tidak valid." };
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan server. Coba lagi nanti." };
  }

  // Redirect AFTER try/catch (redirect throws internally)
  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
