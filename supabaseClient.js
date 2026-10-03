import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/supabase.esm.js";

// 👉 UPDATE THESE WITH YOUR PROJECT DETAILS
const SUPABASE_URL = "https://<YOUR-PROJECT>.supabase.co"; // e.g. https://abcd1234.supabase.co
const SUPABASE_ANON_KEY = "<YOUR-ANON-PUBLIC-KEY>"; // find in Supabase dashboard > API > anon public key

// Initialise the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Sign‑up a new user and optionally insert a row into the `IoT888` table */
export async function signUp(email, password, username = null) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // If a username is supplied, store extra data in the IoT888 table
  if (username) {
    const { error: insertErr } = await supabase.from("IoT888").insert({
      email,
      username,
      created_at: new Date().toISOString()
    });
    if (insertErr) throw insertErr;
  }
  return data;
}

/** Sign‑in an existing user */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Sign‑out */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get rows belonging to the currently‑authenticated user */
export async function getMyIotRows() {
  const user = await supabase.auth.getUser();
  const email = user?.data?.user?.email;
  if (!email) return [];
  const { data, error } = await supabase.from("IoT888").select("*").eq("email", email);
  if (error) throw error;
  return data;
}

/** Upsert (insert or update) a row for the current user */
export async function upsertMyIotRow(row) {
  const user = await supabase.auth.getUser();
  const email = user?.data?.user?.email;
  if (!email) throw new Error("User not signed in");
  const payload = { ...row, email };
  const { data, error } = await supabase.from("IoT888").upsert(payload);
  if (error) throw error;
  return data;
}
