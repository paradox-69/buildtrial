"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase";

// Returns the logged-in user, or sends the visitor to /login.
export function useRequireUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!data.user) router.replace("/login");
        else setUser(data.user);
      });
  }, [router]);

  return user;
}
