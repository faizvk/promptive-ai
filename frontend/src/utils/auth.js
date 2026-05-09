export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

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

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = base64UrlDecode(payload);
    if (!decoded) return null;
    const claims = JSON.parse(decoded);
    return {
      id: claims.id,
      name: claims.name,
      email: claims.email,
      role: claims.role,
    };
  } catch {
    return null;
  }
};
