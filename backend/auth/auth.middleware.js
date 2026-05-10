import { User } from "../model/user.model.js";
import { verifyJwt } from "./tokens.js";

const extractToken = (req) => {
  // Prefer the httpOnly cookie. Fall back to Authorization header so other
  // clients (CLIs, integration tests) can still authenticate.
  if (req.cookies?.access_token) return req.cookies.access_token;
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
};

export const verifyToken = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decoded = verifyJwt(token);

    if (decoded.type && decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    // Validate the token version against the live user record so that a
    // logout / password change immediately invalidates outstanding tokens.
    const user = await User.findById(decoded.id).select(
      "tokenVersion role name email"
    );

    if (!user || (user.tokenVersion ?? 0) !== (decoded.tokenVersion ?? 0)) {
      return res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Re-export createToken for any callers still depending on the old API.
// New code should use setAuthCookies from ./tokens.js.
export { signAccessToken as createToken } from "./tokens.js";
