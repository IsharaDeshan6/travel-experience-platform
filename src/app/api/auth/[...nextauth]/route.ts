import { handlers } from "@/lib/auth";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export const { GET, POST } = handlers;
