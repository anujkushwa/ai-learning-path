"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ allowedRole, children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    const role = user.publicMetadata?.role;
    if (!role) return;

    if (role !== allowedRole) {
      router.replace("/");
    }
  }, [isLoaded, user, allowedRole, router]);

  if (!isLoaded || !user || !user.publicMetadata?.role) {
    return null;
  }

  return children;
}
