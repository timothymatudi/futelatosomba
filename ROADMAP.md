# Futelatosomba Development Roadmap

**Last Updated:** December 8, 2024

This roadmap outlines the development tasks needed to make futelatosomba production-ready and competitive with Rightmove.

---

## Project Status

- **Backend:** 90% complete ✅
- **Frontend:** 40% complete ⚠️
- **Overall:** Production-ready backend, significant frontend work needed

---

## Critical Tasks (Must-Have Before Launch)

### 1. Complete Core Frontend Pages

#### PropertyDetails Page ✅ COMPLETED
- [x] Full property information display
- [x] Image gallery with lightbox/carousel
- [x] Property amenities and features list
- [ ] Interactive map showing property location (placeholder ready)
- [x] Agent contact form/button
- [x] Share property buttons (WhatsApp, Facebook, Twitter, Email, Copy Link)
- [ ] Similar properties section (placeholder ready)
- [x] Breadcrumb navigation

**Files created:**
- ✅ `frontend/futelatosomba-react-app/src/pages/PropertyDetails.jsx`
- ✅ `frontend/futelatosomba-react-app/src/pages/PropertyDetails.css`
- ✅ `frontend/futelatosomba-react-app/src/components/property/PropertyGallery.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/property/PropertyGallery.css`
- ✅ `frontend/futelatosomba-react-app/src/components/property/PropertyInfo.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/property/PropertyInfo.css`
- ✅ `frontend/futelatosomba-react-app/src/components/property/ContactAgentCard.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/property/ContactAgentCard.css`
- ✅ `frontend/futelatosomba-react-app/src/components/property/ShareButtons.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/property/ShareButtons.css`

**Completion Date:** December 8, 2024

---

#### Add/Edit Property Forms ✅ COMPLETED
- [x] Multi-step form wizard for property creation
- [x] Step 1: Basic info (title, description, price, type)
- [x] Step 2: Location (address, city, commune selection)
- [x] Step 3: Details (bedrooms, bathrooms, area, year built)
- [x] Step 4: Features & Amenities (checkboxes/multi-select)
- [x] Step 5: Images (upload, preview, reorder, set primary, captions)
- [x] Form validation with real-time feedback
- [ ] Draft save functionality (future enhancement)
- [x] Edit existing property pre-population

**Files created:**
- ✅ `frontend/futelatosomba-react-app/src/pages/AddProperty.jsx`
- ✅ `frontend/futelatosomba-react-app/src/pages/AddProperty.css`
- ✅ `frontend/futelatosomba-react-app/src/pages/EditProperty.jsx`
- ✅ `frontend/futelatosomba-react-app/src/pages/EditProperty.css`
- ✅ `frontend/futelatosomba-react-app/src/components/property/PropertyForm.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/property/PropertyForm.css`
- ✅ `frontend/futelatosomba-react-app/src/components/property/ImageUploader.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/property/ImageUploader.css`

**Completion Date:** December 8, 2024

---

#### Agent Dashboard ✅ COMPLETED
- [x] My listings overview with stats
- [x] Edit/delete property actions
- [x] View count and favorites per listing
- [ ] Inquiries/messages inbox (future enhancement)
- [ ] Quick actions (mark as sold/rented - future enhancement)
- [ ] Premium listing management (future enhancement)
- [ ] Agency profile editor (future enhancement)

**Files created:**
- ✅ `frontend/futelatosomba-react-app/src/pages/AgentDashboard.jsx`
- ✅ `frontend/futelatosomba-react-app/src/pages/AgentDashboard.css`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/ListingCard.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/ListingCard.css`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/StatsWidget.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/StatsWidget.css`

**Completion Date:** December 8, 2024

---

#### User Dashboard ✅ COMPLETED
- [x] Saved/favorite properties grid
- [x] Saved searches list with edit/delete
- [x] Recently viewed properties
- [ ] Sent inquiries tracking (future enhancement)
- [x] Profile settings editor
- [x] Notification preferences

**Files created:**
- ✅ `frontend/futelatosomba-react-app/src/pages/UserDashboard.jsx`
- ✅ `frontend/futelatosomba-react-app/src/pages/UserDashboard.css`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/SavedPropertyCard.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/SavedPropertyCard.css`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/SavedSearchCard.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/SavedSearchCard.css`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/RecentlyViewedCard.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/RecentlyViewedCard.css`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/ProfileSettings.jsx`
- ✅ `frontend/futelatosomba-react-app/src/components/dashboard/ProfileSettings.css`

**Completion Date:** December 9, 2025

---

### 2. Email Integration

#### Email Service Setup
- [ ] Configure SendGrid or SMTP service
- [ ] Add email credentials to `.env`
- [ ] Create email templates (HTML + plain text)
- [ ] Test email delivery

**Files to create/modify:**
- `backend/services/emailService.js`
- `backend/templates/emails/verification.html`
- `backend/templates/emails/passwordReset.html`
- `backend/templates/emails/propertyAlert.html`
- `backend/templates/emails/contactAgent.html`

---

#### Email Verification
- [ ] Send verification email on registration
- [ ] Email verification endpoint (already exists in backend)
- [ ] Frontend verification success/error pages
- [ ] Resend verification email option
- [ ] Unverified user restrictions

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/VerifyEmail.jsx`
- Update `backend/routes/auth.js` email sending

---

#### Password Reset Flow
- [ ] Frontend "Forgot Password" page
- [ ] Email delivery for reset token
- [ ] Frontend "Reset Password" page with token
- [ ] Success/error messaging
- [ ] Link expiration handling

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/ForgotPassword.jsx`
- `frontend/futelatosomba-react-app/src/pages/ResetPassword.jsx`
- Update `backend/routes/auth.js` email sending

---

#### Property Alerts
- [ ] Background job/cron for checking new matches
- [ ] Email template for property alerts
- [ ] Batch alerts (daily digest vs instant)
- [ ] Unsubscribe functionality
- [ ] Alert preferences UI

**Files to create/modify:**
- `backend/jobs/propertyAlerts.js`
- `backend/utils/cronJobs.js`
- Add node-cron dependency

---

#### Contact Agent Notifications
- [ ] Email to agent when user sends inquiry
- [ ] Email to user confirming inquiry sent
- [ ] Include property details in email
- [ ] Reply-to functionality

**Files to modify:**
- `backend/routes/properties.js` (contact-agent endpoint)

---

### 3. Image Upload System

#### Frontend Upload UI
- [ ] Drag-and-drop zone component
- [ ] File picker fallback
- [ ] Multiple file selection
- [ ] Image preview thumbnails
- [ ] File size/type validation
- [ ] Upload progress bars
- [ ] Error handling (file too large, wrong format)

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/property/ImageUploader.jsx`
- `frontend/futelatosomba-react-app/src/components/common/FileDropzone.jsx`

---

#### Image Management
- [ ] Reorder images (drag-and-drop)
- [ ] Delete individual images
- [ ] Set primary/featured image
- [ ] Add captions to images
- [ ] Image count indicator (e.g., "3 of 20 uploaded")
- [ ] Thumbnail generation

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/property/ImageManager.jsx`

---

#### Backend Integration (Already mostly done)
- [ ] Test Multer upload endpoint
- [ ] Verify Sharp image processing works
- [ ] Add image deletion endpoint
- [ ] Handle image reordering API

**Files to verify/modify:**
- `backend/middleware/upload.js` (already exists)
- `backend/routes/properties.js` (add delete image endpoint)

---

### 4. Essential Features

#### Recently Viewed Properties
- [ ] Track property views in localStorage or backend
- [ ] Display recently viewed section on homepage/dashboard
- [ ] Limit to last 10-20 properties
- [ ] Clear history option

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/context/PropertyContext.jsx` (add tracking)
- `frontend/futelatosomba-react-app/src/components/property/RecentlyViewed.jsx`

---

#### Saved Searches UI
- [ ] Save search form in modal/page
- [ ] Search name input
- [ ] Current filters display
- [ ] Alert frequency selector (instant/daily/weekly)
- [ ] Saved searches list page
- [ ] Edit saved search
- [ ] Delete saved search
- [ ] Run saved search button

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/search/SaveSearchModal.jsx`
- `frontend/futelatosomba-react-app/src/pages/SavedSearches.jsx`
- `backend/routes/users.js` (CRUD endpoints for saved searches)

---

#### Contact Forms
- [ ] Contact agent form on property details
- [ ] General contact page
- [ ] Form validation (email, phone, message)
- [ ] CAPTCHA/bot protection (optional)
- [ ] Success/error messaging
- [ ] Email delivery to recipient

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/property/ContactAgentForm.jsx`
- `frontend/futelatosomba-react-app/src/pages/Contact.jsx`

---

#### Map View
- [ ] Full-screen map view page
- [ ] Property markers with clustering
- [ ] Marker click shows property card popup
- [ ] Filter properties on map
- [ ] Sync map bounds with search results
- [ ] "Search this area" button
- [ ] Current location button

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/MapView.jsx`
- `frontend/futelatosomba-react-app/src/components/map/PropertyMap.jsx`
- `frontend/futelatosomba-react-app/src/components/map/PropertyMarker.jsx`

---

## High Priority (Launch Week 2-4)

### 5. User Experience Improvements

#### Property Image Gallery
- [ ] Lightbox component for fullscreen viewing
- [ ] Keyboard navigation (arrow keys)
- [ ] Touch/swipe gestures for mobile
- [ ] Image counter (1 of 10)
- [ ] Thumbnail strip
- [ ] Zoom functionality
- [ ] Download image option

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/common/Lightbox.jsx`

---

#### Loading States
- [ ] Skeleton screens for property cards
- [ ] Loading spinner for page transitions
- [ ] Progress bar for image uploads
- [ ] Shimmer effect for loading content
- [ ] Lazy loading for images

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/common/Skeleton.jsx`
- `frontend/futelatosomba-react-app/src/components/common/LoadingSpinner.jsx`

---

#### Error Handling
- [ ] 404 page for not found properties
- [ ] Error boundary component
- [ ] User-friendly error messages
- [ ] Retry mechanisms for failed API calls
- [ ] Network offline detection
- [ ] Form error display

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/NotFound.jsx`
- `frontend/futelatosomba-react-app/src/components/common/ErrorBoundary.jsx`

---

#### Form Validation
- [ ] Real-time validation on input change
- [ ] Visual feedback (red border, error icon)
- [ ] Inline error messages
- [ ] Disable submit until valid
- [ ] Success indicators
- [ ] Field-level validation rules

**Files to modify:**
- Update all form components with React Hook Form + Yup

---

#### Mobile Optimization
- [ ] Test on various screen sizes (320px to 1920px)
- [ ] Touch-friendly buttons (min 44px)
- [ ] Hamburger menu for mobile navigation
- [ ] Collapsible filter panels
- [ ] Bottom navigation for key actions
- [ ] Optimize image sizes for mobile
- [ ] Test on iOS Safari and Chrome Android

**Files to modify:**
- All CSS files for responsive breakpoints
- `frontend/futelatosomba-react-app/src/components/common/MobileNav.jsx`

---

### 6. Performance & Scalability

#### Redis Caching
- [ ] Install Redis server
- [ ] Add Redis client to backend
- [ ] Cache property listings (TTL: 5 minutes)
- [ ] Cache search results (TTL: 2 minutes)
- [ ] Cache user sessions
- [ ] Invalidate cache on property updates
- [ ] Cache statistics for admin dashboard

**Files to create/modify:**
- `backend/config/redis.js`
- `backend/middleware/cache.js`
- Update `backend/routes/properties.js` with caching

---

#### Image CDN Integration
- [ ] Create Cloudinary account
- [ ] Configure Cloudinary credentials
- [ ] Upload images to Cloudinary instead of local storage
- [ ] Generate responsive image URLs
- [ ] Implement lazy loading
- [ ] Set up image transformations (resize, crop)
- [ ] Migrate existing images to Cloudinary

**Files to create/modify:**
- `backend/config/cloudinary.js`
- `backend/middleware/upload.js` (update to use Cloudinary)
- `backend/utils/imageUpload.js`

---

#### Database Indexing
- [ ] Review slow queries
- [ ] Add compound indexes for common filters
- [ ] Index on propertyType, listingType, city
- [ ] Index on price, bedrooms, bathrooms
- [ ] Verify geospatial 2dsphere index exists
- [ ] Monitor query performance
- [ ] Add text index for full-text search

**Files to modify:**
- `backend/models/Property.js` (add indexes in schema)

---

#### Pagination Optimization
- [ ] Infinite scroll implementation
- [ ] "Load more" button
- [ ] Virtual scrolling for large lists
- [ ] Cursor-based pagination for better performance
- [ ] Page number display
- [ ] Jump to page input

**Files to modify:**
- `frontend/futelatosomba-react-app/src/components/property/PropertyList.jsx`
- `backend/routes/properties.js` (optimize pagination queries)

---

#### API Response Compression
- [ ] Install compression middleware
- [ ] Enable gzip for API responses
- [ ] Minify JSON responses
- [ ] Add compression for static assets

**Files to modify:**
- `backend/server.js` (add compression middleware)

---

### 7. Admin Features

#### Admin Dashboard UI
- [ ] Statistics cards (users, properties, revenue, donations)
- [ ] Charts for trends (Chart.js or Recharts)
- [ ] Recent activity feed
- [ ] Quick actions panel
- [ ] System health indicators

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/AdminDashboard.jsx`
- `frontend/futelatosomba-react-app/src/components/admin/StatCard.jsx`
- `frontend/futelatosomba-react-app/src/components/admin/ActivityFeed.jsx`

---

#### Content Moderation
- [ ] Pending properties queue
- [ ] Property preview modal
- [ ] Approve/reject buttons with reason
- [ ] Bulk moderation actions
- [ ] Moderation history log
- [ ] Email notifications to agents on approval/rejection

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/AdminModeration.jsx`
- `backend/routes/admin.js` (add approve/reject endpoints)

---

#### User Management
- [ ] User list with search/filter
- [ ] User detail view
- [ ] Edit user role
- [ ] Suspend/activate user
- [ ] Delete user with confirmation
- [ ] View user's properties
- [ ] User activity log

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/AdminUsers.jsx`
- `backend/routes/admin.js` (user CRUD endpoints)

---

#### Transaction Monitoring
- [ ] Transaction list (donations, premium listings)
- [ ] Filter by type, status, date range
- [ ] Transaction details modal
- [ ] Export to CSV
- [ ] Refund functionality
- [ ] Revenue charts

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/AdminTransactions.jsx`
- `backend/routes/admin.js` (transaction endpoints)

---

## Medium Priority (Month 2-3)

### 8. Enhanced Property Features

#### Floor Plans Upload
- [ ] Add floorPlan field to Property model
- [ ] Floor plan image upload (separate from property images)
- [ ] Display floor plan on property details
- [ ] Support PDF floor plans
- [ ] Floor plan viewer/zoom

**Files to modify:**
- `backend/models/Property.js`
- `frontend/futelatosomba-react-app/src/components/property/FloorPlan.jsx`

---

#### Virtual Tour Links
- [ ] Add virtualTourUrl field to Property model
- [ ] Support YouTube, Matterport, 360° tour URLs
- [ ] Embed virtual tour on property details
- [ ] Validation for URL format

**Files to modify:**
- `backend/models/Property.js`
- `frontend/futelatosomba-react-app/src/components/property/VirtualTour.jsx`

---

#### Property Status Updates
- [ ] Status change dropdown (active, sold, rented, inactive)
- [ ] Visual badges on property cards
- [ ] Date sold/rented tracking
- [ ] Archive sold/rented properties
- [ ] Reactivate property option

**Files to modify:**
- `frontend/futelatosomba-react-app/src/components/property/PropertyCard.jsx`
- `backend/routes/properties.js` (status update endpoint)

---

#### Share Property
- [ ] Share buttons (WhatsApp, Facebook, Twitter, Email, Copy link)
- [ ] Social meta tags (Open Graph, Twitter Cards)
- [ ] Preview image generation
- [ ] Share analytics tracking

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/property/ShareButtons.jsx`
- Update `frontend/futelatosomba-react-app/public/index.html` with meta tags

---

### 9. Search Enhancements

#### Search Autocomplete
- [ ] Location autocomplete (cities, communes)
- [ ] Recent searches dropdown
- [ ] Popular searches suggestions
- [ ] Debounced API calls
- [ ] Keyboard navigation

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/search/SearchAutocomplete.jsx`
- `backend/routes/search.js` (autocomplete endpoint)

---

#### Search History
- [ ] Store searches in localStorage or backend
- [ ] Display recent searches
- [ ] Clear search history option
- [ ] Click to re-run search

**Files to modify:**
- `frontend/futelatosomba-react-app/src/context/PropertyContext.jsx`

---

#### Similar Properties
- [ ] Algorithm to find similar properties (same area, price range, type)
- [ ] Display on property details page
- [ ] Configurable similarity criteria

**Files to create/modify:**
- `backend/routes/properties.js` (similar properties endpoint)
- `frontend/futelatosomba-react-app/src/components/property/SimilarProperties.jsx`

---

#### Draw on Map
- [ ] Polygon drawing tool on map
- [ ] Search properties within drawn area
- [ ] Save custom search areas
- [ ] Clear/redraw functionality

**Files to modify:**
- `frontend/futelatosomba-react-app/src/components/map/PropertyMap.jsx`
- Use React Leaflet Draw plugin

---

### 10. Agent Tools

#### Lead Management
- [ ] Inbox for property inquiries
- [ ] Mark as read/unread
- [ ] Reply to inquiries
- [ ] Archive/delete messages
- [ ] Filter by property
- [ ] Lead source tracking

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/AgentInbox.jsx`
- `backend/models/Inquiry.js`
- `backend/routes/inquiries.js`

---

#### Performance Analytics
- [ ] Views per property graph
- [ ] Favorites count
- [ ] Inquiry conversion rate
- [ ] Best performing listings
- [ ] Time on market
- [ ] Export analytics to PDF/CSV

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/AgentAnalytics.jsx`
- `backend/routes/analytics.js`

---

#### Bulk Upload
- [ ] CSV template download
- [ ] CSV file upload
- [ ] Parse and validate CSV
- [ ] Preview imported properties
- [ ] Batch create properties
- [ ] Error reporting

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/BulkUpload.jsx`
- `backend/routes/properties.js` (bulk upload endpoint)
- Add csv-parser dependency

---

#### Agency Branding
- [ ] Agency profile page
- [ ] Upload agency logo
- [ ] Agency description
- [ ] Contact information
- [ ] All properties by agency
- [ ] Agent team members

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/AgencyProfile.jsx`
- `backend/models/Agency.js`
- `backend/routes/agencies.js`

---

### 11. Donation Feature

#### Donation Page
- [ ] Donation landing page
- [ ] Preset amounts ($5, $10, $25, $50, custom)
- [ ] Donation purpose selector
- [ ] One-time vs recurring donations
- [ ] Donor information form
- [ ] Anonymous donation option
- [ ] Stripe payment integration (backend already exists)

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/Donate.jsx`
- `frontend/futelatosomba-react-app/src/components/donation/DonationForm.jsx`

---

#### Donation Campaigns
- [ ] Create donation campaigns
- [ ] Campaign goal tracking
- [ ] Progress bar
- [ ] Campaign description and images
- [ ] Featured campaigns on homepage

**Files to create/modify:**
- `backend/models/Campaign.js`
- `frontend/futelatosomba-react-app/src/components/donation/CampaignCard.jsx`

---

#### Donation Receipt
- [ ] Automated email receipt
- [ ] PDF receipt generation
- [ ] Tax-deductible information (if applicable)
- [ ] Download receipt from dashboard

**Files to create/modify:**
- `backend/utils/receiptGenerator.js`
- `backend/templates/emails/donationReceipt.html`

---

#### Donation Leaderboard (Optional)
- [ ] Top donors list (with permission)
- [ ] Privacy controls
- [ ] Recognition badges
- [ ] Total impact counter

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/DonationLeaderboard.jsx`
- `backend/routes/donations.js` (leaderboard endpoint)

---

## Nice-to-Have (Month 4-6)

### 12. Advanced Features

#### Mortgage Calculator
- [ ] Input fields (price, down payment, interest rate, term)
- [ ] Monthly payment calculation
- [ ] Amortization schedule
- [ ] DRC-specific loan parameters
- [ ] Save calculations

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/MortgageCalculator.jsx`
- `frontend/futelatosomba-react-app/src/utils/mortgageCalculations.js`

---

#### Price History
- [ ] Track price changes over time
- [ ] Price history graph
- [ ] Price reduced badge
- [ ] Price increase indicator

**Files to modify:**
- `backend/models/Property.js` (add priceHistory array)
- `frontend/futelatosomba-react-app/src/components/property/PriceHistory.jsx`

---

#### Market Insights
- [ ] Average prices by area
- [ ] Average prices by property type
- [ ] Market trends graphs
- [ ] Time on market statistics
- [ ] Supply/demand indicators

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/MarketInsights.jsx`
- `backend/routes/analytics.js` (market data endpoints)

---

#### Neighborhood Data
- [ ] Nearby schools
- [ ] Public transport stations
- [ ] Amenities (hospitals, shopping, restaurants)
- [ ] Crime statistics (if available)
- [ ] Walkability score

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/components/property/NeighborhoodData.jsx`
- Integrate external APIs (schools, transport)

---

#### Comparison Tool
- [ ] Add to compare button
- [ ] Compare up to 3-4 properties
- [ ] Side-by-side comparison table
- [ ] Highlight differences
- [ ] Print comparison

**Files to create/modify:**
- `frontend/futelatosomba-react-app/src/pages/CompareProperties.jsx`
- `frontend/futelatosomba-react-app/src/context/CompareContext.jsx`

---

### 13. Communication

#### In-App Messaging
- [ ] Real-time chat with Socket.io
- [ ] Message threads per property
- [ ] Unread message indicators
- [ ] Message notifications
- [ ] File attachment support

**Files to create/modify:**
- `backend/socket/messageHandler.js`
- `frontend/futelatosomba-react-app/src/components/messaging/ChatWindow.jsx`
- Add socket.io-client and socket.io dependencies

---

#### Email Digest
- [ ] Weekly property roundup
- [ ] New properties matching saved searches
- [ ] Price drop alerts
- [ ] Email template design
- [ ] Unsubscribe option

**Files to create/modify:**
- `backend/jobs/emailDigest.js`
- `backend/templates/emails/weeklyDigest.html`

---

#### SMS Alerts (Optional)
- [ ] Twilio integration
- [ ] SMS for critical updates
- [ ] Opt-in/opt-out
- [ ] SMS verification

**Files to create/modify:**
- `backend/services/smsService.js`
- Add twilio dependency

---

#### Push Notifications
- [ ] Browser push notifications
- [ ] Service worker setup
- [ ] Notification preferences
- [ ] New property alerts
- [ ] Price change alerts

**Files to create/modify:**
- `frontend/futelatosomba-react-app/public/service-worker.js`
- `backend/services/pushNotifications.js`

---

### 14. Mobile Apps

#### React Native App
- [ ] Create React Native project
- [ ] Reuse API services
- [ ] Native navigation
- [ ] Native components (camera, location)
- [ ] iOS app build
- [ ] Android app build
- [ ] App Store deployment
- [ ] Google Play deployment

**New Project:**
- `mobile/` directory with React Native app

---

#### Offline Support
- [ ] Service worker for PWA
- [ ] Cache property data
- [ ] Offline viewing of saved properties
- [ ] Sync when online
- [ ] Offline indicator

**Files to modify:**
- `frontend/futelatosomba-react-app/public/service-worker.js`

---

#### Camera Integration
- [ ] Take photos directly in app
- [ ] Photo editing (crop, rotate)
- [ ] Add to property listing
- [ ] QR code scanning (for property codes)

**Mobile app feature**

---

#### Location Services
- [ ] "Properties near me" feature
- [ ] Geolocation permission
- [ ] Distance calculations
- [ ] Sort by distance

**Files to modify:**
- `frontend/futelatosomba-react-app/src/utils/geolocation.js`

---

## Ongoing/Infrastructure

### 15. DevOps & Deployment

#### CI/CD Pipeline
- [ ] GitHub Actions workflow
- [ ] Automated tests on push
- [ ] Build and deploy on merge to main
- [ ] Environment-specific deployments
- [ ] Rollback mechanism

**Files to create:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

---

#### Environment Setup
- [ ] Development environment
- [ ] Staging environment
- [ ] Production environment
- [ ] Environment-specific .env files
- [ ] Database separation

**Files to create:**
- `.env.development`
- `.env.staging`
- `.env.production`

---

#### Monitoring
- [ ] Set up Sentry for error tracking
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] Log aggregation (Loggly, Papertrail)
- [ ] Alert notifications

**Files to modify:**
- `backend/server.js` (add Sentry)
- `frontend/futelatosomba-react-app/src/index.js` (add Sentry)

---

#### Backup Strategy
- [ ] Automated daily MongoDB backups
- [ ] Backup to cloud storage (S3, Google Cloud)
- [ ] Backup retention policy (30 days)
- [ ] Restore testing
- [ ] Disaster recovery plan

**Files to create:**
- `backend/scripts/backup.sh`

---

#### SSL Certificates
- [ ] Obtain SSL certificate (Let's Encrypt)
- [ ] Configure HTTPS
- [ ] Auto-renewal setup
- [ ] Redirect HTTP to HTTPS

**Server configuration**

---

#### Domain Setup
- [ ] Purchase futelatosomba.com domain
- [ ] Configure DNS records
- [ ] Set up subdomain for API (api.futelatosomba.com)
- [ ] Email domain setup (info@futelatosomba.com)

**DNS configuration**

---

### 16. Testing

#### Unit Tests
- [ ] Backend API endpoint tests
- [ ] Model validation tests
- [ ] Utility function tests
- [ ] Middleware tests
- [ ] Achieve 70%+ code coverage

**Files to create:**
- `backend/tests/auth.test.js`
- `backend/tests/properties.test.js`
- Add jest and supertest dependencies

---

#### Integration Tests
- [ ] Frontend component tests
- [ ] Context provider tests
- [ ] Form submission tests
- [ ] API integration tests

**Files to create:**
- `frontend/futelatosomba-react-app/src/__tests__/PropertyCard.test.jsx`
- Add @testing-library/react dependency

---

#### E2E Tests
- [ ] User registration flow
- [ ] Login flow
- [ ] Property search flow
- [ ] Create listing flow
- [ ] Payment flow

**Files to create:**
- `e2e/registration.spec.js`
- Add Cypress or Playwright dependency

---

#### Performance Testing
- [ ] Load testing with k6 or Artillery
- [ ] Identify bottlenecks
- [ ] Database query optimization
- [ ] API response time targets (<200ms)

**Files to create:**
- `tests/load/properties.js`

---

#### Security Audit
- [ ] Penetration testing
- [ ] OWASP Top 10 check
- [ ] Dependency vulnerability scan (npm audit)
- [ ] Security headers verification
- [ ] SQL/NoSQL injection testing

**Tools:**
- npm audit
- Snyk
- OWASP ZAP

---

### 17. Documentation

#### API Documentation
- [ ] Install Swagger/OpenAPI
- [ ] Document all endpoints
- [ ] Request/response examples
- [ ] Authentication documentation
- [ ] Error codes reference

**Files to create:**
- `backend/swagger.json` or use inline JSDoc comments
- Add swagger-ui-express dependency

---

#### User Guide
- [ ] How to search for properties
- [ ] How to save properties
- [ ] How to contact agents
- [ ] How to create an account
- [ ] FAQ section

**Files to create:**
- `frontend/futelatosomba-react-app/src/pages/Help.jsx`
- `docs/user-guide.md`

---

#### Admin Manual
- [ ] Content moderation guide
- [ ] User management guide
- [ ] Analytics interpretation
- [ ] Platform configuration
- [ ] Troubleshooting

**Files to create:**
- `docs/admin-manual.md`

---

#### Developer Docs
- [ ] Project structure explanation
- [ ] Setup instructions
- [ ] Contributing guidelines
- [ ] Code style guide
- [ ] Architecture decisions

**Files to create:**
- `CONTRIBUTING.md`
- `docs/architecture.md`
- Update `README.md`

---

## Priority Execution Plan

### Week 1-2 (MVP Launch)
1. PropertyDetails page
2. Add/Edit Property forms
3. Image upload functionality
4. Email verification
5. Password reset UI

### Week 3-4
6. Agent Dashboard
7. User Dashboard
8. Map integration
9. Saved searches UI
10. Contact forms

### Month 2
11. Redis caching
12. Image CDN (Cloudinary)
13. Admin dashboard UI
14. Mobile optimization
15. Property alerts emails

### Month 3-6
16. Advanced search features
17. Virtual tours
18. Mobile apps
19. Market insights
20. In-app messaging

---

## Success Metrics

### Technical Metrics
- API response time <200ms (p95)
- Page load time <2s
- 99.9% uptime
- Zero critical security vulnerabilities
- 70%+ test coverage

### Business Metrics
- 1,000+ active property listings
- 10,000+ registered users
- 100+ active agents
- 1,000+ daily searches
- 50+ properties listed per week

---

## Notes

- Backend is 90% complete
- Frontend is 40% complete
- Focus on completing frontend for MVP
- Prioritize features that drive user engagement
- Test extensively before launch
- Gather user feedback early and iterate

---

**This roadmap is a living document. Update as priorities change.**
