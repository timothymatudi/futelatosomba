# MongoDB Atlas IP Whitelist Configuration

## Render Outbound IP Addresses
Your Render service uses these IP ranges:
- `74.220.49.0/24`
- `74.220.57.0/24`

## How to Whitelist IPs in MongoDB Atlas

### Step 1: Login to MongoDB Atlas
- Visit: https://cloud.mongodb.com/
- Log in with your credentials

### Step 2: Navigate to Network Access
- Select your project (futelatosomba)
- Click "Network Access" in the left sidebar (under "Security")

### Step 3: Add IP Addresses
For each IP range, you need to add it:

**IP Range 1:**
- Click "Add IP Address"
- Click "Add IP Address" (not "Add Current IP")
- Enter IP Address: `74.220.49.0/24`
- Comment: `Render Backend Server 1`
- Click "Confirm"

**IP Range 2:**
- Click "Add IP Address" again
- Enter IP Address: `74.220.57.0/24`
- Comment: `Render Backend Server 2`
- Click "Confirm"

### Step 4: Verify Whitelist
Your Network Access page should show:
- ✅ `74.220.49.0/24` - Render Backend Server 1
- ✅ `74.220.57.0/24` - Render Backend Server 2
- ✅ `0.0.0.0/0` (if you added "Allow Access from Anywhere") - Optional but convenient

### Alternative: Allow All IPs (Easier but less secure)
If you want to simplify:
- Click "Add IP Address"
- Click "Allow Access from Anywhere"
- This adds: `0.0.0.0/0`
- Click "Confirm"

**Note:** This is safe because MongoDB still requires username/password authentication.

---

## What These IPs Do

When your Render backend tries to connect to MongoDB, the connection comes from one of these IP addresses:
- `74.220.49.0/24` = IP range 74.220.49.0 to 74.220.49.255
- `74.220.57.0/24` = IP range 74.220.57.0 to 74.220.57.255

If these IPs are not whitelisted, MongoDB Atlas will reject the connection and your backend won't be able to access the database.

---

## After Whitelisting

Once you've added the IPs to MongoDB Atlas:
1. Wait 1-2 minutes for changes to propagate
2. Your Render backend should automatically reconnect
3. Test the backend health endpoint:
   ```bash
   curl https://futelatosomba.onrender.com/api/health
   ```

---

## Current Backend Issues

You need to fix TWO things:

### Issue 1: Root Directory (CRITICAL)
- Go to: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/settings
- Set "Root Directory" to: `backend`
- Save and redeploy

### Issue 2: MongoDB Whitelist (ALSO CRITICAL)
- Go to: https://cloud.mongodb.com/
- Add the two IP ranges above
- Wait for changes to propagate

Both issues must be fixed for your backend to work!
