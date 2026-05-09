export const getToken = () => localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
};

const base64UrlDecode = (str) => {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return atob(padded);
  } catch {
    return null;
  }
};

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = base64UrlDecode(payload);
    if (!decoded) return null;
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const isExpired = (claims) => {
  if (!claims || typeof claims.exp !== "number") return true;
  // exp is in seconds since epoch
  return claims.exp * 1000 <= Date.now();
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const claims = decodeToken(token);
  if (!claims || isExpired(claims)) {
    // Stale token — clear it so the rest of the app doesn't act on it.
    localStorage.removeItem("token");
    return false;
  }
  return true;
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  const claims = decodeToken(token);
  if (!claims || isExpired(claims)) return null;

  return {
    id: claims.id,
    name: claims.name,
    email: claims.email,
    role: claims.role,
  };
};
