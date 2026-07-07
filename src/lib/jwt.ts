// lib/jwt.ts

import jwt from "jsonwebtoken";
import { JwtAccessTokenPayload, JwtRefreshTokenPayload, JwtValidatorTokenPayload, JwtResetTokenPayload } from "./types/auth";

const _RAW_SECRET = process.env.JWT_SECRET;
if (!_RAW_SECRET || _RAW_SECRET.length < 32) {
  /* Log loudly — we cannot throw at module-load time since Next.js build
     runs in "production" mode even locally. The runtime will still fail
     if JWT_SECRET is missing when signing/verifying tokens. */
  console.error(
    "[SECURITY CRITICAL] JWT_SECRET is not set or is shorter than 32 characters. " +
    "Set a strong secret in .env before deploying to production."
  );
}
const JWT_SECRET: string = _RAW_SECRET ?? "dev-only-insecure-fallback-change-before-deploying";

export function signAccessToken(user: { id: string; email: string; role?: string; orgId?: string; orgRole?: string }) {
  const payload: JwtAccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    ...(user.orgId   && { orgId:   user.orgId }),
    ...(user.orgRole && { orgRole: user.orgRole }),
    type: "access",
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(userId: string) {
  const jti = crypto.randomUUID();
  const payload: JwtRefreshTokenPayload = {
    sub: userId,
    jti,
    type: "refresh",
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  return { token, jti };
}

export function verifyAccessToken(token: string): JwtAccessTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded !== "object" || !decoded || decoded.type !== "access") {
    throw new Error("Invalid access token");
  }

  return decoded as JwtAccessTokenPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded !== "object" || !decoded || decoded.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  return decoded as JwtRefreshTokenPayload;
}


export function signResetToken(user: { id: string; email: string; }) {
  const payload: JwtResetTokenPayload = {
    sub: user.id,
    email: user.email,
    type: "reset",
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7m" });
}

export function verifyResetToken(token: string): JwtResetTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded !== "object" || !decoded || decoded.type !== "reset") {
    throw new Error("Invalid reset token");
  }

  return decoded as JwtResetTokenPayload;
}

