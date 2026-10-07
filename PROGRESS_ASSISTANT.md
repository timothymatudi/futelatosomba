# Assistant Work Checklist (futelatosomba)

Owner: assistant (fugu). This tracks the work I can complete locally without
production accounts. User-side launch tasks are listed at the bottom.

Last updated: 2026-07-23

## Legend
- [x] done and verified locally
- [~] partially done / needs production verification
- [ ] not started

## Assistant tasks (my side)

- [x] 1. Audit uncommitted work + architecture
- [x] 2. Add backend automated tests (query builder, alert scheduling, multipart normalization, image merge/deletion) and wire `npm test`
- [x] 3. Integrate `PropertyMap` into property details and add list/map search-results toggle
- [x] 4. Add real image management (delete/reorder/caption/primary + safe local file cleanup)
- [x] 5. Run full validation (syntax, backend tests, lint, build, frontend tests, dependency audit, server smoke)
- [ ] 6. Commit completed work

## Already present in the codebase (verified during audit)

- [x] Admin dashboard frontend (`pages/AdminDashboard.jsx`, `/admin` route)
- [x] Similar properties (backend `/:id/similar` + frontend section)
- [x] Saved searches wired to backend (`userService`)
- [x] Property alerts: model, routes, scheduler, dashboard tab, admin trigger
- [x] Mortgage calculator page + route + nav link
- [x] New/exclusive listing model fields, filters, and sorting
- [x] Donate / Premium / NotFound pages

## Local verification results

- [x] Backend tests: 5 test files passed
- [x] Frontend tests: 2 test suites passed
- [x] Frontend ESLint: passed
- [x] Frontend production build: compiled successfully
- [x] Backend startup + `/api/health`: HTTP 200
- [x] Frontend runtime dependency audit: 0 vulnerabilities
- [x] Backend dependency audit: no high/moderate vulnerabilities (2 low inherited from deprecated `csurf`)
- [x] Tracked secret-pattern scan: no real secrets found (examples/placeholders only)

## User tasks (your side — need accounts/production access)

- [ ] Restore/verify backend hosting (Render or alternative)
- [ ] Rotate secrets (MongoDB, JWT, Stripe, SMTP) in the host dashboard
- [ ] Set production env vars (never commit secret values)
- [ ] Run the email-normalization migration against production DB
- [ ] Verify production CORS allowed origins
- [ ] Configure a real email provider (SMTP/SendGrid) and verify delivery
- [ ] Verify Stripe keys/webhooks in production
- [ ] Configure custom domain + DNS (optional Redis)
- [ ] Final business acceptance testing

## Notes for handoff

- Property alerts email in dev uses the `console` provider; set `EMAIL_PROVIDER`
  to `smtp`/`sendgrid` in production for real delivery.
- Alert scheduler can be disabled with `DISABLE_PROPERTY_ALERTS=true` and its
  interval tuned with `PROPERTY_ALERT_INTERVAL_MS`.

## Session log

### 2026-07-23 — production-readiness continuation

- User approved continuing the assistant-side verification work.
- Persistence rule: update this file after each completed review/check/fix so
  future sessions can resume without depending on chat history.
- Re-ran baseline checks before deeper review:
  - Backend JavaScript syntax: passed.
  - Backend tests: 5/5 passed.
  - Frontend ESLint: passed.
  - Frontend production build: compiled successfully.
  - Backend smoke test: started successfully; `/api/health` returned HTTP 200.
- Current stage: reviewing modified and untracked source files for correctness,
  authorization, security, and deployment risks.

#### Confirmed findings from source review

- [x] **Privilege escalation:** an agent could submit `isPremium=true` while
  creating/updating their own property. The backend trusts that request value,
  so the agent can grant the listing premium and then exclusive placement
  without payment/admin authorization. Fixed: only admins or users whose
  account is already premium can manage promotion fields.
- [x] **Approval bypass:** the general property update route accepted `status`
  from an owner. An agent can therefore change a pending listing to `active`
  without using the admin approval route. Fixed: agents may mark listings
  sold/rented/inactive, but only admins may set active/pending.
- [x] **Admin ownership bug:** although `agentAuth` permits admins, property
  update/delete required the admin to be the property owner. Fixed, including
  removal from the actual owner's `properties` array on admin deletion.
- [x] **Stale geospatial data:** updates replaced `location.coordinates` through
  `findByIdAndUpdate`, which does not run the model's pre-save GeoJSON sync.
  Fixed by merging partial locations and explicitly synchronizing GeoJSON.
- [x] **Uploaded-file leaks:** new files are processed before property
  existence/ownership checks and are not removed on 404/403 or all save/update
  failures. Deleting a property also leaves its local image files behind.
  Fixed cleanup for processing errors, validation/authorization/not-found,
  create/update failures, removed images, and deleted properties.
- [x] **Unsafe partial-number updates:** optional numeric fields were converted
  with `Number(undefined)`, producing `NaN`, and the existing undefined-only
  cleanup did not remove those values. Fixed with conditional numeric parsing;
  omitted features/amenities are also preserved on partial updates.
- [x] **Alert email HTML injection:** user/property text was interpolated into
  HTML email without escaping. Fixed and covered by regression test.
- [x] **Image metadata injection:** the update payload could reference an image
  URL not already attached to the property. Fixed by allowlisting retained URLs
  against the property's current images.
- [x] **Public private-listing exposure:** public searches defaulted to all
  statuses and direct URLs exposed pending/inactive listings. Fixed: searches
  default to active and only expose active/sold/rented; private states require
  owner/admin preview authorization.
- [x] **Frontend premium listing filter bug:** the default filter sent
  `isPremium=false`, hiding all premium listings. Fixed by using an empty
  inactive filter and sending `true` only when selected.
- [x] **Agent dashboard response mismatch:** the dashboard expected
  `response.data`, while the service returns the response body directly.
  Fixed by accepting the actual array/object response shapes.

#### Verification after fixes

- Backend JavaScript syntax: passed.
- Backend tests: 6/6 test files passed, including new permission and HTML
  escaping regression coverage.
- Frontend ESLint: passed.
- `git diff --check`: passed.
- Next stage: frontend tests/build, dependency audits, MongoDB connectivity,
  API/runtime smoke checks, and final review.
