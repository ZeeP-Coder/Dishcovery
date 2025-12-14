# Console Tampering Protection

## Problem
Users could manipulate their admin privileges by editing `sessionStorage` values directly in the browser console:
```javascript
// Attacker could do this in console:
let user = JSON.parse(sessionStorage.getItem("dishcovery:user"));
user.isAdmin = true;  // ⚠️ Illegal privilege escalation
sessionStorage.setItem("dishcovery:user", JSON.stringify(user));
```

## Solution Implemented

### 1. **Continuous Server Verification** (Primary Defense)
- App checks backend database every 5 seconds to verify actual user status
- If local storage doesn't match backend truth, it's automatically corrected
- Backend is the single source of truth - never trust client-side data

### 2. **Automatic Synchronization**
- When mismatch detected, session storage is updated with real backend data
- Page reloads to apply correct privileges
- No logout required - seamless correction

### 3. **Console Warning System**
- Users see warning if they try to manually edit session storage
- Reminds them that changes will be reverted

### 4. **Backend Authorization** (Already Implemented)
- All sensitive endpoints verify admin status from database
- Backend ignores any client-supplied admin claims
- Even if frontend is bypassed, backend protects itself

## How It Works

```
User Action (Console):
sessionStorage.setItem("dishcovery:user", '{"isAdmin": true, ...}')
                ↓
⚠️ WARNING displayed
                ↓
Within 5 seconds:
Frontend checks backend → Backend says "isAdmin: false"
                ↓
Frontend syncs: Updates local storage to match backend
                ↓
Page reloads with correct privileges
```

## Testing the Protection

### Test 1: Try to Make Yourself Admin
```javascript
// In browser console:
let user = JSON.parse(sessionStorage.getItem("dishcovery:user"));
user.isAdmin = true;
sessionStorage.setItem("dishcovery:user", JSON.stringify(user));

// Result: Warning shown, within 5 seconds corrected back to false + page reloads
```

### Test 2: Try to Remove Admin Status
```javascript
// In browser console (as admin):
let user = JSON.parse(sessionStorage.getItem("dishcovery:user"));
user.isAdmin = false;
sessionStorage.setItem("dishcovery:user", JSON.stringify(user));

// Result: Warning shown, within 5 seconds corrected back to true + page reloads
```

## Security Layers

1. **Frontend Protection**: Continuous monitoring (5-second intervals)
2. **Backend Validation**: All endpoints check database for admin status
3. **Route Guards**: Admin routes verify privileges before rendering
4. **User Warning**: Console message discourages tampering

## Why This is Secure

✅ **Backend is Source of Truth**: Database determines actual privileges
✅ **Continuous Monitoring**: Catches tampering within 5 seconds
✅ **Automatic Recovery**: No manual intervention needed
✅ **Defense in Depth**: Multiple layers prevent exploitation
✅ **No Trust in Client**: Backend always verifies independently

## Backend Security (Already in Place)

The backend protects itself even if frontend is completely bypassed:

```java
// UserController.java - Every admin operation checks database
private boolean isUserAdmin(int userId) {
    UserEntity user = userService.getUserById(userId);
    return user != null && user.getAdmin();
}

// All sensitive endpoints:
@PutMapping("/updateUser")
public ResponseEntity<?> updateUser(@RequestHeader("X-User-Id") int requesterId, ...) {
    if (!isUserAdmin(requesterId)) {
        return ResponseEntity.status(403).body("Forbidden");
    }
    // ...
}
```

## Monitoring

Check browser console for these messages:
- `⚠️ WARNING: Modifying session data manually is not allowed...` - Tampering detected
- `Session data mismatch detected. Syncing with server...` - Automatic correction happening

## Developer Notes

- The 5-second interval is configurable (change in App.js)
- Backend verification is the real security - frontend is just UX improvement
- Never add sensitive logic based on client-side isAdmin flag
- Always verify privileges on backend for any sensitive operation
