# JWT Authentication - Postman Test Cases

## PHASE 2: LOGIN & JWT - COMPLETE TEST GUIDE

**Base URL:** `http://localhost:5001`

---

## TEST SEQUENCE

### Step 1: Register a Test User

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/register`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "email": "testlogin@example.com",
  "username": "testlogin123",
  "password": "SecurePass123!",
  "firstName": "Test",
  "lastName": "Login"
}
```

---

### Step 2: Login and Get Tokens

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "identifier": "testlogin@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cm...",
      "email": "testlogin@example.com",
      "username": "testlogin123",
      "firstName": "Test",
      "lastName": "Login",
      "emailVerified": false,
      "roles": ["user"]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "15m"
    }
  }
}
```

**IMPORTANT:** Save the `accessToken` and `refreshToken` for next steps!

---

### Step 3: Login with Username

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "identifier": "testlogin123",
  "password": "SecurePass123!"
}
```

**Note:** Works with both email AND username!

---

### Step 4: Failed Login - Wrong Password

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "identifier": "testlogin@example.com",
  "password": "WrongPassword123!"
}
```

**Expected Response:** 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401
}
```

---

### Step 5: Failed Login - Non-existent User

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "identifier": "nonexistent@example.com",
  "password": "AnyPassword123!"
}
```

**Expected Response:** 401 Unauthorized

---

### Step 6: Refresh Access Token

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/refresh`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_FROM_STEP_2"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Step 7: Logout

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/logout`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_FROM_STEP_2"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Step 8: Try to Use Old Refresh Token (Should Fail)

**Method:** `POST`  
**URL:** `http://localhost:5001/api/v1/auth/refresh`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "refreshToken": "YOUR_OLD_REFRESH_TOKEN"
}
```

**Expected Response:** 401 Unauthorized

---

## TESTING ACCOUNT LOCKOUT

### Test Multiple Failed Attempts

Try logging in with wrong password **5 times** in a row:

**Request:** (Repeat 5 times)
```json
POST http://localhost:5001/api/v1/auth/login
{
  "identifier": "testlogin@example.com",
  "password": "WrongPassword!"
}
```

**After 5th attempt:** Account locked for 15 minutes
```json
{
  "success": false,
  "message": "Account is locked due to too many failed login attempts. Try again in 15 minutes.",
  "statusCode": 401
}
```

---

## QUICK COPY-PASTE FORMAT

**Login:**
```
POST http://localhost:5001/api/v1/auth/login
{"identifier":"testlogin@example.com","password":"SecurePass123!"}
```

**Refresh Token:**
```
POST http://localhost:5001/api/v1/auth/refresh
{"refreshToken":"PASTE_YOUR_REFRESH_TOKEN_HERE"}
```

**Logout:**
```
POST http://localhost:5001/api/v1/auth/logout
{"refreshToken":"PASTE_YOUR_REFRESH_TOKEN_HERE"}
```

---

## WHAT'S IMPLEMENTED

✅ **JWT Access Tokens** (15 minutes expiry)  
✅ **JWT Refresh Tokens** (7 days expiry)  
✅ **Refresh token storage** in database  
✅ **Login with email OR username**  
✅ **Account lockout** after 5 failed attempts  
✅ **Password verification** with bcrypt  
✅ **Last login tracking**  
✅ **Audit logging** for security events  
✅ **Logout** (invalidates refresh token)  
✅ **Token refresh** mechanism  

---

## POSTMAN TIPS

1. **Save tokens as variables:**
   - After login, go to Tests tab:
   ```javascript
   pm.environment.set("accessToken", pm.response.json().data.tokens.accessToken);
   pm.environment.set("refreshToken", pm.response.json().data.tokens.refreshToken);
   ```

2. **Use Authorization header:**
   - For protected routes: `Bearer {{accessToken}}`

3. **Test expired tokens:**
   - Wait 15 minutes for access token to expire
   - Try to refresh it with refresh token

---

Ready to test! Just make sure server is running on port 5001.
