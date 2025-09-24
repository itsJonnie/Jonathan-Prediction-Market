// src/client.ts
import { createThirdwebClient } from "thirdweb";

// Provide a safe fallback so local dev doesn't crash if env isn't set.
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "local-dev-placeholder";
export const client = createThirdwebClient({ clientId });
