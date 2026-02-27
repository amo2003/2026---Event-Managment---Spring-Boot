# PayHere "Unauthorized" Error - Complete Fix Guide

## Problem
PayHere gateway opens but shows "Unauthorized" message inside the popup.

## Root Causes & Solutions

### Solution 1: Verify Your PayHere Account (Most Common)

Your PayHere sandbox account might not be fully activated.

**Steps:**
1. Check your email for PayHere verification email
2. Click the verification link
3. Login to https://sandbox.payhere.lk/
4. Complete your profile if prompted
5. Wait 5-10 minutes for account activation

### Solution 2: Add Allowed Domains

**Steps:**
1. Login to https://sandbox.payhere.lk/
2. Go to **Settings** → **Domains & Credentials**
3. Scroll to **Allowed Domains**
4. Click **Add Domain**
5. Add these one by one:
   ```
   http://localhost:3000
   http://localhost:8080
   localhost:3000
   localhost:8080
   ```
6. Click **Save**
7. **Restart your backend server**

### Solution 3: Check Merchant Status

1. Login to https://sandbox.payhere.lk/
2. Check if you see a banner saying "Account Pending" or "Verify Email"
3. If yes, complete the verification process
4. Your merchant ID: **1231683**

### Solution 4: Use Test Merchant ID (Temporary)

If your account isn't working, use PayHere's public test merchant:

**Update `application.properties`:**
```properties
payhere.merchant.id=1221149
payhere.merchant.secret=test_secret
payhere.sandbox=true
payhere.currency=LKR
```

**Restart backend and test**

### Solution 5: Create Fresh Account

If nothing works, create a new sandbox account:

1. **Sign Up:**
   - Go to https://sandbox.payhere.lk/
   - Click **Sign Up** (not Login)
   - Use a different email
   - Fill all required fields
   - Submit

2. **Verify Email:**
   - Check your email inbox
   - Click verification link
   - Login to dashboard

3. **Get Credentials:**
   - Go to **Settings** → **Domains & Credentials**
   - Copy **Merchant ID**
   - Copy **Merchant Secret**

4. **Add Domains:**
   - In same page, scroll to **Allowed Domains**
   - Add: `http://localhost:3000`
   - Add: `http://localhost:8080`
   - Save

5. **Update Backend:**
   ```properties
   payhere.merchant.id=YOUR_NEW_MERCHANT_ID
   payhere.merchant.secret=YOUR_NEW_MERCHANT_SECRET
   ```

6. **Restart & Test**

## Testing Checklist

Before testing payment:

- [ ] Email verified
- [ ] Account activated (no pending status)
- [ ] Domains added (localhost:3000, localhost:8080)
- [ ] Credentials updated in application.properties
- [ ] Backend restarted
- [ ] Browser cache cleared

## Test Payment

Use these test cards:

**Visa (Success):**
```
Card: 4916217501611292
Expiry: 12/25
CVV: 123
Name: Test User
```

**MasterCard (Success):**
```
Card: 5307732125531135
Expiry: 12/25
CVV: 123
Name: Test User
```

## Debugging Steps

### 1. Check Browser Console (F12)
Look for:
```javascript
PayHere Payment Config: {
  sandbox: true,
  merchant_id: "1231683",
  amount: "5000.00",
  ...
}
```

### 2. Check Backend Console
Look for:
```
PayHere config requested
Merchant ID: 1231683
Sandbox: true
```

### 3. Test Merchant ID Directly

Open browser console and run:
```javascript
payhere.startPayment({
  sandbox: true,
  merchant_id: "1231683",
  return_url: "http://localhost:3000",
  cancel_url: "http://localhost:3000",
  notify_url: "http://sample.com/notify",
  order_id: "TEST123",
  items: "Test Item",
  amount: "100.00",
  currency: "LKR",
  first_name: "Test",
  last_name: "User",
  email: "test@test.com",
  phone: "0771234567",
  address: "Test Address",
  city: "Colombo",
  country: "Sri Lanka"
});
```

If this shows "Unauthorized", your merchant account has an issue.

## Common Mistakes

❌ **Wrong:** Using production merchant ID with sandbox=true
✅ **Correct:** Use sandbox merchant ID with sandbox=true

❌ **Wrong:** Not verifying email
✅ **Correct:** Check email and verify account

❌ **Wrong:** Not adding domains
✅ **Correct:** Add localhost:3000 and localhost:8080

❌ **Wrong:** Using old credentials after creating new account
✅ **Correct:** Update application.properties with new credentials

## Still Not Working?

### Option A: Contact PayHere Support
- Email: support@payhere.lk
- Subject: "Sandbox Account Unauthorized Error"
- Include: Your merchant ID (1231683)

### Option B: Use Alternative Payment (Temporary)
While waiting for PayHere to work:
- Use **Card Payment** option (works immediately)
- Use **Bank Slip** option (manual approval)

### Option C: Wait and Retry
Sometimes PayHere sandbox takes time to activate:
- Wait 24 hours after signup
- Try again
- Check for email from PayHere

## Success Indicators

You'll know it's working when:
1. ✅ PayHere popup opens
2. ✅ Shows payment form (not "Unauthorized")
3. ✅ Can enter card details
4. ✅ Test card processes successfully
5. ✅ Redirects back to your app

## Production Notes

For production (real payments):
1. Sign up at https://www.payhere.lk/ (not sandbox)
2. Complete business verification (takes 1-3 days)
3. Get production credentials
4. Add your real domain
5. Set `payhere.sandbox=false`
6. Test with small real amount first

## Quick Test Command

Restart backend and run:
```bash
# In backend directory
./mvnw spring-boot:run

# Check logs for:
# "PayHere config requested"
# "Merchant ID: 1231683"
```

Then test payment in browser.
