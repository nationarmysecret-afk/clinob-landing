const ADMIN_PASSWORD = "clinicanutricionrd..2026";
const COOKIE_NAME = "clinob_admin_token";
const TOKEN_VALUE = Buffer.from(ADMIN_PASSWORD).toString("base64");

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function getToken(): string {
  return TOKEN_VALUE;
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function verifyToken(token: string | undefined): boolean {
  return token === TOKEN_VALUE;
}