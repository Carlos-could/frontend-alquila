const requiredPublicKeys = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type RequiredPublicKey = (typeof requiredPublicKeys)[number];

type PublicEnv = Record<RequiredPublicKey, string>;

function readPublicEnv(): PublicEnv {
  const values: Record<RequiredPublicKey, string | undefined> = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const missing = requiredPublicKeys.filter((key) => {
    const value = values[key];
    return !value || value.startsWith("__SET_ME");
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required frontend environment variables: ${missing.join(", ")}. ` +
        "Set them in .env.local using .env.example as a reference."
    );
  }

  return {
    NEXT_PUBLIC_API_URL: values.NEXT_PUBLIC_API_URL as string,
    NEXT_PUBLIC_SUPABASE_URL: values.NEXT_PUBLIC_SUPABASE_URL as string,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: values.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  };
}

export const env = readPublicEnv();
