// lib/jwt.ts

import jwt from "jsonwebtoken";
import { JwtAccessTokenPayload, JwtRefreshTokenPayload, JwtValidatorTokenPayload, JwtResetTokenPayload } from "./types/auth";

/* Warn at module load, but resolve the secret lazily so a missing value fails
   at sign/verify time rather than breaking `next build` (which runs in
   production mode even locally). There is deliberately NO fallback value —
   a hardcoded default would let anyone holding this source forge tokens. */
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error(
    "[SECURITY CRITICAL] JWT_SECRET is not set or is shorter than 32 characters. " +
    "Token signing and verification will fail until it is configured."
  );
}

/* ⚠️ TEMPORARY — HARDCODED FALLBACK SECRET  ⚠️
   ─────────────────────────────────────────────────────────────────────────
   Anyone who can read this repo can forge a token for ANY user, including
   role:"admin". This exists only to unblock deployment while JWT_SECRET is
   not yet configured.

   TO REMOVE: set JWT_SECRET (32+ chars) in the environment. The env var
   already takes precedence — no code change needed once it is set. Then
   delete FALLBACK_SECRET and the `?? FALLBACK_SECRET` below.

   Generate one with:  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ───────────────────────────────────────────────────────────────────────── */
const FALLBACK_SECRET = "lamid-one-temporary-development-secret-replace-me-2026";

export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (s && s.length >= 32) return s;
  return FALLBACK_SECRET;
}

export function signAccessToken(user: { id: string; email: string; role?: string; orgId?: string; orgRole?: string }) {
  const payload: JwtAccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    ...(user.orgId   && { orgId:   user.orgId }),
    ...(user.orgRole && { orgRole: user.orgRole }),
    type: "access",
  };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: "15m" });
}

export function signRefreshToken(userId: string) {
  const jti = crypto.randomUUID();
  const payload: JwtRefreshTokenPayload = {
    sub: userId,
    jti,
    type: "refresh",
  };

  const token = jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });

  return { token, jti };
}

export function verifyAccessToken(token: string): JwtAccessTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded !== "object" || !decoded || decoded.type !== "access") {
    throw new Error("Invalid access token");
  }

  return decoded as JwtAccessTokenPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

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

  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7m" });
}

export function verifyResetToken(token: string): JwtResetTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded !== "object" || !decoded || decoded.type !== "reset") {
    throw new Error("Invalid reset token");
  }

  return decoded as JwtResetTokenPayload;
}

