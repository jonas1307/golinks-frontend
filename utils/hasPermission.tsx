import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  permissions?: string[];
}

export function hasPermission(token: string, permission: string): boolean {
  try {
    const decodedToken = jwt.decode(token) as CustomJwtPayload | null;

    const permissions = decodedToken?.permissions || [];

    return permissions.includes(permission);
  } catch (error) {
    return false;
  }
}
