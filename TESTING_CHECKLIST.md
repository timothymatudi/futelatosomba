# Testing Checklist - Futelatosomba Live Deployment

## URLs
- **Frontend:** https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
- **Backend:** https://futelatosomba.onrender.com
- **GitHub:** https://github.com/timothymatudi/futelatosomba

---

## ✅ Quick Health Checks

### 1. Backend Health Check
```bash
curl https://futelatosomba.onrender.com/api/health
```
**Expected:** 
```json
{
  "status": "healthy",
  "timestamp": "2024-12-09T...",
  "uptime": 123
}
```

⚠️ **Note:** If backend shows error, it may be sleeping (free tier). Wait 30 seconds and retry.

### 2. Frontend Homepage
**Visit:** https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app

**Should See:**
- ✅ Congo flag colors (blue, yellow, red)
- ✅ "Futelatosomba" branding
- ✅ Property search form
- ✅ Navigation menu (Home, About, Contact, etc.)
- ✅ Footer

---

## 🧪 Feature Testing

### Test 1: User Registration ✅

1. Click "Register" or "S'inscrire"
2. Fill in form:
   - Email: test@example.com
   - Password: Test123!
   - Full Name: Test User
3. Click Submit
4. **Expected:**
   - ✅ Success message
   - ✅ Redirect to dashboard or login
   - ✅ Email verification sent (check Render logs)

**Check Render Logs:**
- Go to Render dashboard
- Click on your service
- Click "Logs" tab
- Look for: "Verification email sent"

---

### Test 2: Email Verification ✅

1. Check Render backend logs for verification link
2. Copy the token from logs (looks like: `token=abc123...`)
3. Visit: `https://futelatosomba-frontend.../verify-email?token=YOUR_TOKEN`
4. **Expected:**
   - ✅ "Email verified successfully" message
   - ✅ Redirect to login after 3 seconds

---

### Test 3: Login ✅

1. Click "Login" or "Se connecter"
2. Enter credentials:
   - Email: test@example.com
   - Password: Test123!
3. Click Submit
4. **Expected:**
   - ✅ Success message
   - ✅ Redirect to dashboard
   - ✅ User menu appears in header

---

### Test 4: Password Reset ✅

1. Click "Forgot Password"
2. Enter email: test@example.com
3. Click Submit
4. Check Render logs for reset link
5. Visit reset link
6. Enter new password
7. **Expected:**
   - ✅ Password updated
   - ✅ Can login with new password

---

### Test 5: Browse Properties ✅

1. Go to homepage
2. Scroll to properties section
3. **Expected:**
   - ✅ Properties load from backend
   - ✅ Property cards display properly
   - ✅ Images, prices, locations visible

**If no properties:**
- This is normal! No data added yet
- Shows "No properties found" message

---

### Test 6: View Property Details ✅

1. Click on any property (if available)
2. **Expected:**
   - ✅ Property details page loads
   - ✅ Image gallery works
   - ✅ Property info displays
   - ✅ Contact agent form visible
   - ✅ Share buttons work

---

### Test 7: Agent Registration ✅

1. Register as agent (or convert user to agent)
2. Login
3. **Expected:**
   - ✅ "Agent Dashboard" appears in menu
   - ✅ Can access /agent-dashboard
   - ✅ "Add Property" button visible

---

### Test 8: Add Property (Agent Only) ✅

1. Login as agent
2. Click "Add Property"
3. Fill multi-step form:
   - **Step 1:** Title, description, price
   - **Step 2:** Location (city, commune)
   - **Step 3:** Details (beds, baths, area)
   - **Step 4:** Amenities (checkboxes)
   - **Step 5:** Images (upload)
4. Click "Create Property"
5. **Expected:**
   - ✅ Property created
   - ✅ Redirect to agent dashboard
   - ✅ Property appears in listings

---

### Test 9: Contact Agent ✅

1. View any property
2. Fill contact form:
   - Name: Your name
   - Email: your@email.com
   - Message: Test inquiry
3. Click Submit
4. **Expected:**
   - ✅ Success message
   - ✅ Agent receives email (check Render logs)
   - ✅ User receives confirmation email

---

### Test 10: Search & Filter ✅

1. Go to homepage
2. Use search filters:
   - Select city: Kinshasa
   - Select property type: House
   - Set price range
3. Click Search
4. **Expected:**
   - ✅ Filters apply
   - ✅ Results update
   - ✅ URL updates with params

---

## 🔍 Common Issues & Solutions

### Issue 1: Backend Not Responding
**Symptom:** Frontend shows "No response from server"

**Solution:**
1. Render free tier sleeps after 15 min inactivity
2. First request wakes it up (takes 30-60 seconds)
3. Wait and refresh page
4. Check Render logs for errors

---

### Issue 2: CORS Errors
**Symptom:** Console shows "CORS policy" errors

**Solution:**
1. Check backend CORS config in server.js
2. Should allow: https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
3. Redeploy if needed

---

### Issue 3: Images Not Uploading
**Symptom:** Upload fails or images don't show

**Solution:**
1. Check file size (max 5MB)
2. Check file type (JPEG, PNG, WebP)
3. Check Render logs for errors
4. Verify Multer is configured

---

### Issue 4: Emails Not Sending
**Symptom:** No emails received

**Solution:**
1. Check Render environment variables:
   - SMTP_HOST
   - SMTP_USER
   - SMTP_PASSWORD
2. Check Render logs for email errors
3. Verify SendGrid API key is valid
4. Check SendGrid sender verification

---

### Issue 5: Database Connection Failed
**Symptom:** "Database connection error"

**Solution:**
1. Check MongoDB Atlas:
   - Network Access has Render IPs:
     * 74.220.49.0/24
     * 74.220.57.0/24
   - Database user exists
   - Connection string correct
2. Check Render env var: MONGO_DATABASE_URL
3. Check Render logs for specific error

---

## 📊 Monitoring

### Check Render Logs
```
1. Go to: https://dashboard.render.com/
2. Click your service
3. Click "Logs" tab
4. Watch real-time logs
```

### Check Vercel Logs
```
1. Go to: https://vercel.com/dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Logs" or "Runtime Logs"
```

### Check MongoDB Atlas
```
1. Go to: https://cloud.mongodb.com/
2. Click "Database"
3. Click "Metrics" to see connections
4. Click "Collections" to see data
```

---

## ✅ Success Criteria

Your app is working if:

- ✅ Frontend loads without errors
- ✅ Backend /api/health returns 200
- ✅ Can register new user
- ✅ Can login
- ✅ Properties display (if any exist)
- ✅ Can add property (as agent)
- ✅ Contact form works
- ✅ Emails send (check logs)

---

## 🚀 Next Steps After Testing

1. **Add Real Data**
   - Add some properties manually
   - Test with real images
   - Create multiple user accounts

2. **Configure Production Services**
   - MongoDB Atlas: Upgrade if needed
   - SendGrid: Verify domain
   - Stripe: Add live keys

3. **Custom Domain** (Optional)
   - Buy domain (futelatosomba.com)
   - Configure in Vercel & Render
   - Update environment variables

4. **Performance Optimization**
   - Monitor Vercel Analytics
   - Check SpeedInsights
   - Optimize images

5. **SEO & Marketing**
   - Add meta tags
   - Submit to Google
   - Social media setup

---

**Happy Testing!** 🎉

If you encounter any issues, check Render and Vercel logs first!
