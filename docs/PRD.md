# Product Requirements Document — Closet

**The Social Wardrobe**

| | |
|---|---|
| Author | Ali |
| Version | 1.0 — MVP |
| Date | March 2026 |
| Status | Draft |

---

## 1. Vision & Problem

### 1.1 Problem Statement

People own far more clothing than they wear. The average person regularly uses about 20% of their wardrobe. The rest sits in closets, occasionally purged to Goodwill or sold on Depop. Meanwhile, friends with compatible taste and size routinely buy new clothes they could have borrowed.

Existing solutions miss the mark. Resale platforms (Depop, Poshmark, ThredUp) are transactional and public — you're selling to strangers, not sharing with people you trust. Rental services (Rent the Runway, Nuuly) are expensive, impersonal, and limited to their own inventory. Group chats and text threads work in theory but have no structure — no catalog, no tracking, no way to browse.

### 1.2 Core Insight

Your friends' closets are the best-curated, most trusted, and most accessible source of clothing you're not using. The unlock is giving friend groups a shared digital layer on top of their combined physical wardrobes.

### 1.3 Vision

Closet is a private social wardrobe for your inner circle. Upload your clothes, let friends browse and style outfits from your closet (or mix pieces across closets), and trade freely. Default in-person, with on-demand delivery when needed.

Think of it as a group closet that lives on your phone.

---

## 2. Target User

### 2.1 Primary Persona

| Attribute | Detail |
|---|---|
| Age | 18–30 |
| Location | Dense urban areas (NYC, LA, London, etc.) |
| Social behavior | Active friend group of 5–20 people; hangs out regularly; already shares or borrows clothes informally |
| Fashion relationship | Cares about style but not obsessed with luxury; values variety and expression over ownership |
| Pain point | Owns too many clothes, still feels like they have nothing to wear. Wants fresh fits without buying more. |

### 2.2 Why Close Friends, Not Public

- **Trust**: you know they'll return your stuff and treat it well
- **Taste overlap**: your friends already influence what you wear
- **Logistics**: your friends are physically nearby
- **Fun**: styling your friend's outfit is inherently social and entertaining

---

## 3. Product Overview

Closet is a mobile-first app (iOS priority, Android fast-follow) built around four core capabilities:

| # | Capability | What It Does |
|---|---|---|
| 1 | Upload | Digitize your wardrobe with flexible upload methods (photo dump, single snap, mirror selfie extraction). AI auto-tags category, color, brand, season. |
| 2 | Style | Browse a friend's closet and put together outfits for them. Combine pieces from multiple closets into cross-closet outfits. |
| 3 | Trade | Request to borrow any item. Owner approves, you pick up or get it delivered. Built-in tracking of who has what and for how long. |
| 4 | Social | Feed of outfits styled by friends, reactions, fit checks, and outfit challenges within your group. |

---

## 4. User Stories

### 4.1 Upload & Catalog

- **US-1**: As a user, I can take a photo of a clothing item and have it auto-tagged with category (top, bottom, outerwear, shoes, accessories), color, and season so I don't have to manually enter details.
- **US-2**: As a user, I can bulk-upload from my camera roll and have AI separate and tag each item, so I can digitize my closet quickly.
- **US-3**: As a user, I can upload a mirror selfie or fit pic and have AI extract individual pieces into separate items in my closet.
- **US-4**: As a user, I can manually edit tags, add brand info, set availability status (available, in use, not for sharing), and mark items as "favorite".

### 4.2 Styling

- **US-5**: As a user, I can browse a friend's closet by category and put together an outfit for them using their pieces.
- **US-6**: As a user, I can combine items from my closet with items from a friend's closet to build a cross-closet outfit.
- **US-7**: As a user, I receive a notification when a friend styles an outfit for me, and I can save, react to, or request the items.
- **US-8**: As a user, I can save outfits to my "Saved Fits" collection for later.

### 4.3 Trading & Borrowing

- **US-9**: As a user, I can request to borrow an item from a friend's closet. The owner receives a notification and can approve or decline.
- **US-10**: As a user, I can set a default borrow duration (e.g. 1 week) and receive reminders when it's time to return.
- **US-11**: As a user, I can see a "Who Has My Stuff" dashboard showing all items currently lent out, to whom, and for how long.
- **US-12**: As a user, I can choose to pick up in person (default) or request delivery when borrowing an item.

### 4.4 Social & Discovery

- **US-13**: As a user, I see a feed of outfits my friends have styled (for themselves or others), and I can react, comment, or request items from those outfits.
- **US-14**: As a user, I can post a "fit check" to my group showing what I'm wearing today.
- **US-15**: As a user, I can create outfit challenges (e.g. "style me for a first date using only my closet") that friends can respond to.

### 4.5 Groups & Trust

- **US-16**: As a user, I can create a Closet Group by inviting friends via link or contacts. Groups are capped at 20 members.
- **US-17**: As a user, I can control visibility per-item: visible to all groups, specific groups only, or private.
- **US-18**: As a group admin, I can remove members or adjust group settings.

---

## 5. Core Flows

### 5.1 Onboarding

1. Sign up (phone number or Apple/Google SSO)
2. Create or join a Closet Group (invite link)
3. Upload your first 10 items (guided flow with bulk upload option)
4. Browse your friends' closets and style your first outfit

The onboarding goal is to get a user into a group with at least 3 members and 10 items each within the first session. This is the activation threshold.

### 5.2 Borrow Flow

1. User taps "Request" on an item or outfit
2. Selects pickup method: in-person (default) or delivery
3. Owner receives push notification and approves/declines
4. If delivery: on-demand courier dispatched (Uber Direct / DoorDash Drive API)
5. Item status updates to "Lent to [Name]" in owner's closet
6. Return reminder sent at borrow duration (configurable)
7. Borrower confirms return; item status reverts to "Available"

### 5.3 Styling Flow

1. User selects "Style" on a friend's profile
2. Enters a canvas view showing friend's available items by category
3. Drags items onto an outfit board (top, bottom, shoes, accessories slots)
4. Can toggle "Mix Closets" to pull in their own items or other friends' items
5. Saves and sends outfit to the friend with an optional note
6. Friend receives notification, can save, react, or request items

---

## 6. AI & Intelligence Layer

AI is infrastructure, not a feature. It powers the experience without being the experience.

### 6.1 Upload Intelligence

- **Auto-categorization**: top, bottom, outerwear, shoes, accessory, bag
- **Color extraction** (primary + accent)
- **Season and occasion tagging** (casual, formal, athletic, going out)
- **Brand detection** via logo/label recognition where possible
- **Mirror selfie decomposition**: identify and segment individual garments from a full outfit photo

### 6.2 Styling Intelligence (v2+)

- Outfit suggestions based on color theory, style compatibility, and what pieces are available across connected closets
- "Complete This Outfit" feature: user picks one item, AI suggests complementary pieces from available closets
- Weather-aware suggestions based on local forecast and item season tags

---

## 7. Logistics & Delivery

### 7.1 In-Person (Default)

Most exchanges should happen organically. The app facilitates by showing mutual availability and suggesting meetup windows. In-app messaging thread auto-created when a borrow request is approved.

### 7.2 On-Demand Delivery

For same-city friends who can't meet up, delivery is available via courier API integration.

| Detail | Spec |
|---|---|
| Provider | Uber Direct API or DoorDash Drive API (whichever has better coverage per market) |
| Who pays | Borrower pays delivery fee. Displayed upfront before confirming request. |
| Packaging | Courier picks up from owner's door. Owner bags item in any bag/container. |
| Return delivery | Borrower can request return pickup at end of borrow period (same courier API). |
| Range | Same city. Max radius configurable per market (default: 10 miles). |

---

## 8. Trust & Accountability

Trust is the product's foundation. The system enforces lightweight accountability without making it feel transactional.

- **Borrow history**: full log of who borrowed what, when, and return status
- **Return reminders**: configurable push notifications (default: 7 days)
- **Gentle nudges**: if an item is overdue, the owner can send a one-tap "Hey, can I get this back?" nudge
- **Reputation signals (v2)**: reliability score based on on-time returns, visible to group members
- **Damage handling (v2)**: photo-on-return flow where borrower photographs item before marking as returned. Owner can flag issues.

No deposits or money between friends in v1. The social pressure of a small group is the enforcement mechanism.

---

## 9. Information Architecture

| Tab | Purpose |
|---|---|
| Home | Feed of recent outfits, fit checks, and activity from your groups |
| Closets | Browse your closet and friends' closets. Entry point for styling. |
| Style | Outfit builder canvas. Select a friend (or yourself), drag pieces, save outfits. |
| Activity | Borrow requests (incoming/outgoing), return reminders, outfit reactions. |
| Profile | Your closet stats, saved fits, borrow history, group management, settings. |

---

## 10. Technical Architecture

| Layer | Stack |
|---|---|
| Mobile client | React Native (iOS + Android from single codebase) |
| Backend | Node.js / Express or Next.js API routes |
| Database | PostgreSQL (users, groups, items, outfits, borrow records) |
| Image storage | AWS S3 / Cloudflare R2 with CDN |
| AI services | Vision API for auto-tagging (GPT-4o or Claude vision); background removal API |
| Delivery | Uber Direct API / DoorDash Drive API |
| Auth | Phone OTP + Apple/Google SSO |
| Notifications | Firebase Cloud Messaging (FCM) + APNs |
| Real-time | WebSockets for in-app messaging and live status updates |

---

## 11. Data Model (Core Entities)

**User**
`id, name, phone, avatar_url, created_at`

**Group**
`id, name, invite_code, created_by, max_members (default 20), created_at`

**GroupMembership**
`user_id, group_id, role (admin | member), joined_at`

**Item**
`id, owner_id, image_url, category, color, brand, season, occasion, status (available | lent | unavailable), visibility (all_groups | specific_groups | private), created_at`

**Outfit**
`id, created_by, styled_for (user_id), items[] (array of item_ids, can span multiple owners), note, created_at`

**BorrowRequest**
`id, item_id, borrower_id, owner_id, status (pending | approved | declined | active | returned), pickup_method (in_person | delivery), borrow_duration_days, requested_at, approved_at, returned_at`

**Delivery**
`id, borrow_request_id, provider (uber | doordash), tracking_url, status, fee_cents, created_at`

---

## 12. Monetization

v1 is free. The product needs network density before monetization matters. Potential revenue paths:

- **Delivery margin**: take a small cut on courier fees (5–15%)
- **Premium tier**: expanded group sizes, unlimited closet uploads, advanced AI styling suggestions, outfit history analytics
- **Brand partnerships (v3+)**: brands seed items into the network for organic exposure. Friends discover and style with sponsored pieces.

No ads. No selling user closet data. Trust is the product.

---

## 13. Metrics & Success Criteria

### 13.1 Activation

- User uploads 10+ items within first 48 hours
- User joins or creates a group with 3+ members within first session

### 13.2 Engagement (Weekly)

- Outfits styled per user per week (target: 2+)
- Borrow requests sent per group per week (target: 3+)
- Feed opens per user per week (target: 5+)

### 13.3 Retention

- D7 retention: 60%+
- D30 retention: 40%+
- Monthly active groups (groups with 2+ borrow events/month): 70%+

### 13.4 North Star Metric

**Items actively circulating per group per month.** This captures the core value: clothes moving between friends, not sitting in closets.

---

## 14. MVP Scope & Phasing

### 14.1 MVP (v1)

- Upload (all three methods: single snap, bulk upload, mirror selfie extraction)
- AI auto-tagging (category, color, season)
- Closet Groups (create, invite, browse)
- Outfit builder (single-closet and cross-closet styling)
- Borrow request flow (request, approve, track, return)
- In-person pickup (default) + delivery via Uber Direct
- Social feed (styled outfits, fit checks, reactions)
- Push notifications for requests, approvals, reminders

### 14.2 v2

- AI outfit suggestions and "Complete This Outfit"
- Weather-aware recommendations
- Reputation / reliability scores
- Photo-on-return damage flow
- Outfit challenges and group games
- Premium tier

### 14.3 v3+

- Brand seeding partnerships
- Public style profiles (opt-in)
- Shopping integration: see an item you love in a friend's closet, buy your own via affiliate link
- Cross-group discovery (friends of friends, opt-in)

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Onboarding friction (uploading is tedious) | Users abandon before reaching activation threshold | Bulk upload + AI tagging minimize effort. "Start with 10" guided flow. Gamify with progress bar. |
| Friends don't return items | Trust erodes, users stop sharing | Return reminders, nudge system, borrow history visibility. Social pressure in small groups is strong. |
| Group doesn't reach critical mass | Empty closets = no value, no retention | Require 3+ members to activate group. Prompt users to invite during onboarding. Show value preview with demo closets. |
| Delivery costs make it feel less "free" | Users default to never using delivery | In-person is the default and primary mode. Delivery is an option, not the expectation. Transparent pricing. |
| Damage or loss of items | Bad experiences kill word of mouth | v1: social trust + small groups. v2: photo-on-return flow, optional item valuation, group-level resolution. |

---

## 16. Open Questions

- Should items have a value/price tag (even informal) to set expectations around care?
- Should there be a "keep it" option where a friend can claim an item permanently if the owner is willing to let it go?
- How do we handle sizing differences within a friend group? Surface size info or let friends self-select?
- Should outfit styling be anonymous by default (revealed after the person reacts) to make it more fun?
- What's the right group size cap? 20 feels right for trust but may be too large for some circles.
- Do we need a waitlist / invite-only launch to build exclusivity and manage quality?
