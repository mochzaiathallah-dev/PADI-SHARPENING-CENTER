"use client";

import { logoutAction } from "@/lib/auth-actions";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`flex items-center space-x-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all px-3 py-2 rounded-lg disabled:opacity-50 ${className || ""}`}
    >
      {isPending ? (
        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      <span>{isPending ? "Keluar..." : "Logout"}</span>
    </button>
  );
}
