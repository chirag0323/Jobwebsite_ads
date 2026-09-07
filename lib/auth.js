import crypto from "crypto";

const cookieName = "opportunity_admin";
const secret = process.env.ADMIN_SESSION_SECRET || "development-only-change-me";

function signature() { return crypto.createHmac("sha256", secret).update("admin").digest("hex"); }
export function isAuthenticated(cookieStore) { return cookieStore.get(cookieName)?.value === signature(); }
export function sessionCookie() { return `${cookieName}=${signature()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`; }
export function clearSessionCookie() { return `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`; }
