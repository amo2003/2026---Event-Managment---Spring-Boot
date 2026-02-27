# PayHere Payment Gateway Setup Guide

## Overview
This application integrates PayHere payment gateway for stall payments. Follow these steps to configure your PayHere credentials.

## Step 1: Get PayHere Sandbox Account

1. Visit [PayHere Sandbox](https://sandbox.payhere.lk/)
2. Sign up for a free sandbox account
3. Login to your sandbox dashboard

## Step 2: Get Your Credentials

1. Go to **Settings** → **Domains & Credentials**
2. Copy your **Merchant ID** (e.g., 1227569)
3. Copy your **Merchant Secret** (a long alphanumeric string)

## Step 3: Configure Backend

Open `backend/backend/src/main/resources/application.properties` and update:

```properties
# PayHere Configuration (Sandbox)
payhere.merchant.id=YOUR_MERCHANT_ID_HERE
payhere.merchant.secret=YOUR_MERCHANT_SECRET_HERE
payhere.sandbox=true
payhere.currency=LKR
```

Replace:
- `YOUR_MERCHANT_ID_HERE` with your actual Merchant ID
- `YOUR_MERCHANT_SECRET_HERE` with your actual Merchant Secret

## Step 4: Test Payment

### Sandbox Test Cards:

**Visa:**
- Card Number: `4916217501611292`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- Name: Any name

**MasterCard:**
- Card Number: `5307732125531135`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**American Express:**
- Card Number: `371449635398431`
- Expiry: Any future date
- CVV: Any 4 digits
- Name: Any name

## Step 5: Production Setup

When ready for production:

1. Sign up at [PayHere Production](https://www.payhere.lk/)
2. Complete business verification
3. Get production credentials
4. Update `application.properties`:

```properties
payhere.merchant.id=YOUR_PRODUCTION_MERCHANT_ID
payhere.merchant.secret=YOUR_PRODUCTION_MERCHANT_SECRET
payhere.sandbox=false
payhere.currency=LKR
```

## Payment Flow

1. User selects "Pay via PayHere"
2. PayHere popup opens with payment form
3. User enters card details
4. Payment is processed
5. On success:
   - Backend marks payment as APPROVED
   - QR code is generated
   - Email confirmation sent
   - User redirected to profile

## Troubleshooting

### "Unauthorized" Error
- Check if Merchant ID is correct
- Verify Merchant Secret is set
- Ensure you're using sandbox credentials for sandbox mode

### Payment Not Completing
- Check browser console for errors
- Verify notify_url is accessible
- Check backend logs for PayHere notifications

### Testing Tips
- Always use sandbox test cards
- Don't use real card numbers in sandbox
- Check PayHere sandbox dashboard for transaction logs

## Security Notes

⚠️ **Important:**
- Never commit real merchant secrets to version control
- Use environment variables for production
- Keep merchant secret confidential
- Verify payment signatures in production

## Support

- PayHere Documentation: https://support.payhere.lk/
- PayHere Sandbox: https://sandbox.payhere.lk/
- PayHere Support: support@payhere.lk
