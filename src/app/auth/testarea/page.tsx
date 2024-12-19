"use client";
import { useSession, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>; // Saat sedang memuat sesi
  }

  if (!session) {
    return <p>You are not signed in</p>;
  }

  if (session) {
    console.log(session);
  }

  return <> Nothing to see here..</>;
}
