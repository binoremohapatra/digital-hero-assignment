import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyToken(input: string) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const session = (await cookies()).get('auth_token')?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('auth_token')?.value;
  if (!session) return;

  const parsed = await verifyToken(session);
  if (!parsed) return;

  // Refresh the session so it doesn't expire
  const res = new Response();
  res.headers.set(
    'Set-Cookie',
    `auth_token=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400` // 24 hours
  );
  return res;
}
