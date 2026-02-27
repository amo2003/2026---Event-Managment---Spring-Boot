# Fix PayHere "Unauthorized payment request" Error

## The Problem
You're getting "Unauthorized payment request" because PayHere needs your domain to be whitelisted.

## Solution - Step by Step

### Step 1: Login to PayHere Sandbox
1. Go to https://sandbox.payhere.lk/
2. Login with your credentials

### Step 2: Add Allowed Domains
1. Click on **Settings** (gear icon) in the left menu
2. Click on **Domains & Credentials**
3. Scroll to **Allowed Domains** section
4. Add these domains:
   ```
   http://localhost:3000
   http://localhost:8080
   ```
5. Click **Save**

### Step 3: Verify Your Credentials
In the same **Domains & Credentials** page:
1. Check your **Merchant ID** (should match in application.properties)
2. Check your **Merchant Secret** (should match in application.properties)

Your current config:
```
Merchant ID: 1231683
Merchant Secret: Nzg4MzE1MTUyMTg2ODM2NzM2NDQyMDQwNTA5NjE3NzU1NzI4NTE=
```

### Step 4: Restart Backend
After adding domains, restart your Spring Boot backend:
```bash
# Stop the backend (Ctrl+C)
# Start it again
./mvnw spring-boot:run
```

### Step 5: Test Payment
Use these test cards in PayHere sandbox:

**Visa (Success):**
- Card: `4916217501611292`
- Expiry: `12/25`
- CVV: `123`
- Name: `Test User`

**MasterCard (Success):**
- Card: `5307732125531135`
- Expiry: `12/25`
- CVV: `123`
- Name: `Test User`

## Alternative: Create New Sandbox Account

If the above doesn't work, create a fresh account:

### 1. Sign Up
- Go to https://sandbox.payhere.lk/
- Click **Sign Up**
- Fill in your details
- Verify email

### 2. Get Credentials
- Login to dashboard
- Go to **Settings** → **Domains & Credentials**
- Copy **Merchant ID**
- Copy **Merchant Secret**

### 3. Add Domains
Add these domains in **Allowed Domains**:
```
http://localhost:3000
http://localhost:8080
```

### 4. Update Backend
Edit `backend/backend/src/main/resources/application.properties`:

```properties
payhere.merchant.id=YOUR_NEW_MERCHANT_ID
payhere.merchant.secret=YOUR_NEW_MERCHANT_SECRET
payhere.sandbox=true
payhere.currency=LKR
```

### 5. Restart & Test
- Restart backend
- Try payment again

## Common Issues

### Issue 1: Domain Not Whitelisted
**Error:** "Unauthorized payment request"
**Fix:** Add localhost:3000 and localhost:8080 to allowed domains

### Issue 2: Wrong Credentials
**Error:** "Unauthorized payment request"
**Fix:** Double-check Merchant ID and Secret match exactly

### Issue 3: Sandbox vs Production
**Error:** "Unauthorized payment request"
**Fix:** Make sure `payhere.sandbox=true` for sandbox credentials

### Issue 4: Special Characters in Secret
**Error:** Configuration error
**Fix:** Merchant secret should be base64 encoded string (no spaces)

## Verify Setup

Check browser console (F12) for:
```
PayHere Payment Config: {
  sandbox: true,
  merchant_id: "1231683",
  ...
}
```

Check backend console for:
```
PayHere config requested
Merchant ID: 1231683
Sandbox: true
Currency: LKR
```

## Still Not Working?

1. **Clear browser cache** and reload
2. **Try incognito mode**
3. **Check PayHere status**: https://status.payhere.lk/
4. **Contact PayHere support**: support@payhere.lk

## Production Checklist

When moving to production:

- [ ] Sign up at https://www.payhere.lk/ (not sandbox)
- [ ] Complete business verification
- [ ] Add production domain (e.g., yourdomain.com)
- [ ] Get production credentials
- [ ] Update application.properties with production credentials
- [ ] Set `payhere.sandbox=false`
- [ ] Test with real small amount first
- [ ] Implement MD5 signature verification
- [ ] Set up webhook/notify URL properly

## Support Resources

- PayHere Docs: https://support.payhere.lk/
- Integration Guide: https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout
- Sandbox Dashboard: https://sandbox.payhere.lk/
- Test Cards: https://support.payhere.lk/faq/test-card-numbers
