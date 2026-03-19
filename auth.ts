// This file is no longer needed - using JWT authentication instead
// The auth configuration is now handled by:
// - /src/app/api/admin/login/route.ts (JWT login)
// - /src/app/api/admin/logout/route.ts (JWT logout)
// - /src/middleware.ts (JWT verification)

export default function AuthConfig() {
  return null;
}
