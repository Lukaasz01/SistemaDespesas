const TOKEN_KEY = 'meu_token';
const USER_NAME_KEY = 'nomeUsuario';
const USER_ID_KEY = 'usuario_id';

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_NAME_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}

export function hasValidAuthToken(now = Date.now()): boolean {
  const token = getStoredToken();

  if (!token) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    const payloadText = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadText) as { exp?: number };

    if (typeof payload.exp !== 'number') {
      return true;
    }

    return payload.exp * 1000 > now;
  } catch {
    return false;
  }
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}
