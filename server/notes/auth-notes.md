1. User Authentication / Login

User logs in with email/password (or OAuth in future).

Backend validates credentials.

Backend generates two tokens:

Access Token (short-lived): contains id and possibly roles/permissions.

Refresh Token (long-lived): contains only id, used to get new access tokens.

Tokens are sent to the client:

Access Token: stored in a cookie (or sometimes in memory, depending on setup).

Refresh Token: stored in httpOnly cookie (cannot be accessed by JS, secure).

2. Client Stores Tokens

Frontend receives tokens after login:

JWT cookie → Access Token

refreshToken cookie → Refresh Token

Optionally, frontend keeps tokens in local storage/memory for API requests (but safer in cookies).

3. Client Makes Authenticated Requests

Frontend makes a request to a protected endpoint (e.g., /api/superAdmin/users).

Middleware intercepts the request:

Tries to read Authorization header first.

If not provided, it can fallback to cookies (as you implemented).

4. Access Token Validation (Authentication Middleware)

Middleware extracts token:

From Authorization header (Bearer <token>)
OR fallback to JWT cookie.

Middleware decodes and verifies the token with ACCESS_TOKEN_SECRET.

Middleware fetches the latest user info from DB:

Roles, permissions, active status.

If everything checks out, middleware attaches a user object to req.user.

Request proceeds to controller.

5. Token Expiration Handling

Access Token is short-lived:

When it expires, requests fail with 401 Unauthorized.

Frontend detects 401 → triggers token refresh flow.

Refresh Token is sent automatically via httpOnly cookie.

6. Refresh Token Flow

Frontend hits /api/auth/refresh-token.

Backend verifies the refresh token using REFRESH_TOKEN_SECRET.

If valid:

New access token is generated.

Sent back in JWT cookie.

Client retries the original request with the new access token.

7. Role & Permission Authorization

Once access token is verified and user is attached to req.user, authorization can happen:

authorizeRole → checks if user roles match allowed roles.

authorizePermission → checks if user permissions include required actions.

Controller executes only if authorization passes.

8. Logout

Frontend clears cookies (JWT and refreshToken) to log out the user.

Access token becomes invalid naturally due to expiration.

Flow Summary (Chronologically)
[Login]
↓
[Issue Access + Refresh Tokens]
↓
[Store Tokens in Cookies]
↓
[Client Requests Protected Endpoint]
↓
[Middleware Verifies Access Token]
↓
[Attach User to req.user]
↓
[Authorize Roles/Permissions]
↓
[Controller Handles Request]
↓
[If Access Token Expired → Use Refresh Token]
↓
[Issue New Access Token → Retry Request]
↓
[Logout → Clear Cookies]

✅ Key Notes:dex

Access token: short-lived, used for normal requests.

Refresh token: long-lived, only used to get new access tokens.

Middleware always checks fresh user data from DB, not just the token.

Authorization is separate from authentication: roles/permissions are checked after user is validated.
