"use server";

import { createClient } from '@/app/lib/supabase/server';
import Dashboard from './dashboard';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const client = await createClient();
  const { data, error } = await client.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth");
  }

  return (
    <Dashboard user={data!.user} />
  );
}
