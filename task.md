# Shintai Driveshaft - Feature: Dual Login (Google + LINE)

## Phase 1: Authentication Infrastructure
- [x] Install `next-auth` LINE provider configuration <!-- id: shintai-1 -->
- [x] Create `/login` page with Dual Login UI (UI/UX Pro Max) <!-- id: shintai-2 -->
- [x] Update Navbar to redirect to `/login` <!-- id: shintai-3 -->
- [x] Verify Mobile Responsiveness <!-- id: shintai-4 -->

## Phase 2: User Experience
- [x] Design Login Card (Glassmorphism, Centered) <!-- id: shintai-5 -->
- [x] Implement Loading States (Spinner on click) <!-- id: shintai-6 -->
- [x] Handle Errors (e.g. User denied access) <!-- id: shintai-7 -->
- [x] Implement Manual "Add Friend" Button (Admin Configurable) <!-- id: shintai-8 -->
- [x] Fix Security Vulnerabilities (Middleware, API Auth) <!-- id: shintai-9 -->

## Phase 3: LINE LIFF Integration
- [x] Install LIFF SDK (`@line/liff`) <!-- id: shintai-10 -->
- [x] Create `LiffProvider` Context <!-- id: shintai-11 -->
- [x] Implement UI Adaptations (Hide Navbar/Footer in LIFF) <!-- id: shintai-12 -->
- [x] Verify LIFF Initialization in Browser <!-- id: shintai-13 -->

## Phase 4: LINE Experience Optimization & Warranty
- [x] Implement "My Warranty" Page (Auto-fetch for logged-in users) <!-- id: shintai-14 -->
- [x] Secure Booking Pages (Force Login) <!-- id: shintai-15 -->
- [x] Optimize Navbar/Footer (Hide via `?view=frame`) <!-- id: shintai-16 -->
- [x] Fix Application Error (Suspense Boundary) <!-- id: shintai-17 -->
- [x] Implement Auto-Login in LINE Environment <!-- id: shintai-18 -->

---
# LumiLogic 10 - Phase 1: The Shell

## Project Initialization
- [x] Initialize Next.js 14+ Project (TypeScript, Tailwind, App Router) <!-- id: 0 -->
- [x] Establish Design System (UI/UX Pro Max) <!-- id: 1 -->
- [x] Install Dependencies (R3F, Framer Motion, Phosphor Icons, clsx, tailwind-merge) <!-- id: 2 -->

## Core Layout System
- [x] Implement `GameContainer` (4:3 aspect ratio, soft shadow, responsive, centered) <!-- id: 3 -->
- [x] Setup `layout.tsx` (Global styles, fonts, meta tags) <!-- id: 4 -->

## World Map & Navigation (Forest Hub)
- [x] Create `WorldMap` Component (5 Modules Visuals) <!-- id: 5 -->
    - [x] Spatial Reasoning (Active)
    - [x] Number Sense (Locked/Fog)
    - [x] Logic (Locked/Fog)
    - [x] Patterns (Locked/Fog)
    - [x] Algorithms (Locked/Fog)
- [x] Implement "Passport/Stamp" Completion Ritual UI <!-- id: 6 -->

## 3D Foundation (Spatial Module)
- [x] Create R3F Canvas Component <!-- id: 8 -->
- [x] Implement `ChamferedCube` with Wooden Texture <!-- id: 9 -->
- [x] Configure OrbitControls (Damped, Restricted, "Toy" feel) <!-- id: 10 -->
- [x] Optimize 3D Block & Viewport (RoundedBox, Ma/Whitespace, Tactile Material) <!-- id: 13 -->

## Passport System (Phase 2)
- [x] Implement `PassportModal` (Book UI, Framer Motion open/close) <!-- id: 14 -->
- [x] Design Stamp Grid & Logic (Unlocked/Locked states) <!-- id: 15 -->
- [x] Integrate Passport Button with Modal State <!-- id: 16 -->
- [x] Create (Conceptual) `StampOverlay` component <!-- id: 17 -->

## Spatial Reasoning Module (The Shadow Detective)
- [x] Implement `PerspectiveCheck` Logic (Compare OrbitControls angle with Target) <!-- id: 18 -->
- [x] Add `TargetView` UI (Goal Image Overlay) <!-- id: 19 -->
- [x] Implement `HandHint` Animation (Idle 5s) <!-- id: 20 -->
- [x] Implement `SuccessSequence` (Light flash, Sound, Stamp Trigger) <!-- id: 21 -->
- [x] Implement `InitialRandomRotation` & 1s Interaction Lock (Anti-Instant Win) <!-- id: 23 -->
- [x] Implement `EmissiveGlowHint` (Glows when < 20deg error) <!-- id: 24 -->

## Phase 3: Polish & Passport Renewal
- [x] Refactor `PassportModal` to 3D Book Flip Interface <!-- id: 25 -->
    - [x] Implement `Book` container with `preserve-3d`
    - [x] Create `Page` component with Front/Back faces
    - [x] Implement "Cover", "Chapter 1", "Chapter 2 (Locked)" pages
- [x] Mobile Responsiveness for Passport (Vertical/Single Page) <!-- id: 26 -->
- [x] Smooth World Map Paths (Cubic Bezier) <!-- id: 27 -->

## Phase 4: Refinements & Bug Fixes
- [x] Fix Passport Notification Logic (Only show if stamps > 0 && unseen) <!-- id: 28 -->
- [x] Fix Passport Icon Styling (Rounded corners, overflow hidden) <!-- id: 29 -->
- [x] Implement "Star Marker" on 3D Block & Target View <!-- id: 30 -->
- [x] Implement Hot/Cold Feedback (Border Color & Variable Glow) <!-- id: 31 -->
- [x] Implement "Show Goal" Demo Logic (Target -> Wait -> Scramble) <!-- id: 32 -->

- [x] Implement "Show Goal" Demo Logic (Target -> Wait -> Scramble) <!-- id: 32 -->

## Phase 5: Visual Overhaul (Japanese Forest)
- [x] Implement "Stepping Stone" Nodes & Breathing Animation <!-- id: 33 -->
- [x] Add Layered SVG Background (Hills/Trees Silhouettes) <!-- id: 34 -->
- [x] Refine World Map Path (Organic Dashed & Animated) <!-- id: 35 -->
- [x] Typography Polish (Rounded Serif & Dot Patterns) <!-- id: 36 -->

## Phase 6: CRITICAL HOTFIXES
- [x] Bug 1: Fix Passport Icon White Corners (rounded-3xl + overflow-hidden) <!-- id: 37 -->
- [x] Bug 2: Add "Flip Left" Navigation to Passport Modal <!-- id: 38 -->
- [x] Bug 3: Fix 3D Block Size (Camera Z) & Texture (Decal) <!-- id: 39 -->
- [x] Bug 4: Fix Game View UI Overlap (Move Target Down) <!-- id: 40 -->

## Phase 7: UX REFINEMENTS
- [x] Refine 3D Camera (Z=15) & OrbitControls (Smoothness) <!-- id: 41 -->
- [x] Fix Passport Icon Clipping (Transparent BG + Radius) <!-- id: 42 -->
- [x] Fix Passport Nav Logic (Flip Back vs Close) <!-- id: 43 -->
- [x] Scale Star Marker (60% size) <!-- id: 44 -->

## Phase 8: CRITICAL UX RESTORATION
- [x] Fix Passport Dead Click (Restore onClick & Check Z-Index) <!-- id: 45 -->
- [x] Fix Spatial Camera (Z=12, Center, FOV 45) <!-- id: 46 -->
- [x] Move "Match This" UI to Bottom-Left <!-- id: 47 -->
- [x] Verify Passport Nav Logic (Back Arrow -> Page 0) <!-- id: 48 -->

## Phase 9: FINAL UI POLISH
- [x] Passport Icon Hard Fix (CSS: overflow-hidden, radius 24px, transparent) <!-- id: 49 -->
- [x] Passport Nav Logic Check (Page 2->1->0, No Close on Prev) <!-- id: 50 -->
- [x] Spatial Camera Z=18 & Damping 0.1 <!-- id: 51 -->
- [x] Star Decal Scale 0.5 <!-- id: 52 -->
- [x] UI Alignment (Top Margin for Target) <!-- id: 53 -->

## Phase 10: ABSOLUTE HOTFIXES (NO RETRIES)
- [x] Passport Root Cause (Style Override !important) <!-- id: 54 -->
- [x] Passport Nav Logic (Global Prev Button, Page > 0 -> -1) <!-- id: 55 -->
- [x] Spatial Camera Z=25, FOV 35, Mesh Scale 0.5 <!-- id: 56 -->
- [x] UI Alignment (Bottom-Right 40px) <!-- id: 57 -->

## Phase 11: FINAL REFINEMENTS
- [x] Passport Chapter 2 Visibility (Structure Refactor) <!-- id: 58 -->
- [x] Passport White Edges (Opacity Fix) <!-- id: 59 -->
- [x] Spatial Size AGGRESSIVE (Z=30, Scale=0.4) <!-- id: 60 -->

## Phase 13: KID UX OVERHAUL
- [x] Spatial Size AGGRESSIVE (Z=35, Scale=0.35) <!-- id: 62 -->
- [x] Keyhole Mechanic (Center Overlay + Ghost Star) <!-- id: 63 -->

## Phase 14: FEEDBACK ITERATION 2
- [x] PWA Icon: Fix iPad support (`apple-touch-icon` meta) <!-- id: 64 -->
- [x] Spatial: Scale `0.25`, Z `40` (Tiny) <!-- id: 65 -->
- [x] Passport Edge: Fix Cover White Bleed (Opacity on Back Face) <!-- id: 66 -->
- [x] Passport Nav: Fix Back Button Logic (Explicit SetPage) <!-- id: 67 -->

## Phase 15: VISUAL & LOGIC INTEGRITY
- [x] Passport Visibility: Hide Chapter 2/1 completely when closed (Fix "Opens to Ch2") <!-- id: 68 -->
- [x] Passport Polish: Robust Opacity Toggle for all layers <!-- id: 69 -->
- [x] Spatial: Scale `0.2`, Z `45` (Micro) <!-- id: 70 -->

## Phase 16: POLISH ITERATION 4
- [x] Passport: Remove redundant "Back/Close" buttons (Use Global Prev only) <!-- id: 71 -->
- [x] Spatial: Fix Size by removing `Stage` (Manual Lighting) <!-- id: 72 -->

## Phase 17: GOLDILOCKS SIZE FIX
- [x] Spatial: Set Scale `1.8`, Z `15` (Optimal Size) <!-- id: 73 -->

## Phase 18: MEGA POLISH
- [x] Spatial: Mega Scale `6.5` (4x) for bold presence <!-- id: 74 -->
- [x] Spatial: Lighter Wood Color (`#F5DEB3`) <!-- id: 75 -->
- [x] Spatial: Lock Pitch (Turntable Mode) for intuitive matching <!-- id: 76 -->

## Phase 19: STABILITY & LOGIC POLISH
- [x] Spatial: Remove `Float` to prevent Vertical Drift (Stable Center) <!-- id: 77 -->
- [x] Spatial: Color `#FFEFD5` (PapayaWhip) <!-- id: 78 -->
- [x] Spatial: Normalize Win Angle Logic (Prevent mismatch on wrap-around) <!-- id: 79 -->

## Phase 20: PREMIUM POLISH (SENIOR ENGINEER)
- [x] Spatial: Glossy Material (MeshPhysical, Clearcoat, Color `#F2D7B6`) <!-- id: 80 -->
- [x] Spatial: Unlock Rotation (Sphere) + Inertia Damping <!-- id: 81 -->
- [x] Spatial: Perfect Centering & Studio Lighting (Environment) <!-- id: 82 -->

## Phase 21: LOGIC UPGRADE
- [x] Spatial: Vector-Based Win Condition (Camera vs Z-Axis) <!-- id: 83 -->
- [x] Spatial: Celebration Sequence (Freeze, Stamp UI) <!-- id: 84 -->

## Deployment (Phase 12)
- [x] Create Chinese README.md <!-- id: 61 -->
- [x] Git Init & Push to GitHub <!-- id: 62 -->

## Phase 22: MODULE 2 - SETUP (FOREST BALANCE)
- [x] Install Physics Dependencies (`@react-three/cannon`, `@use-gesture/react`) <!-- id: 85 -->
- [x] Create `NumbersLevel.tsx` Architecture <!-- id: 86 -->

## Phase 23: THE 3D SCALE
- [x] Implement `BalanceScale` Component (Compound Body, Hinge Constraint) <!-- id: 87 -->
- [x] Apply Premium Wood Material (#E0C097, Glossy) <!-- id: 88 -->

## Phase 24: PINECONES & DRAG
- [x] Implement `Pinecone` Mesh (Low Poly Sphere/Texture) <!-- id: 89 -->
- [x] Implement Drag Logic (useGesture + Raycaster) <!-- id: 90 -->
- [x] Setup Initial State (Left Tray = 3, Right Tray = 0) <!-- id: 91 -->

## Phase 25: WIN LOGIC
- [x] Track Hinge Angle (0 deg tolerance) <!-- id: 92 -->
- [x] Implement Success Sequence (Pulse, Passport Animation) <!-- id: 93 -->

## Phase 26: LOGIC & PERSISTENCE (FINAL POLISH)
- [x] Fix Drag Parallax (Ray-Plane Intersection) <!-- id: 94 -->
- [x] Refactor Win Logic (Explicit Item Counting vs Physics) <!-- id: 95 -->
- [x] Implement Persistence (LocalStorage for Stamps) <!-- id: 96 -->
- [x] Implement Home Screen Unlock Logic <!-- id: 97 -->
- [x] Create Design Whitepaper & Update Readme <!-- id: 98 -->

## Phase 27: PHOTOGRAPHER DAD ADD-ON (MOVED TO SEPARATE REPO)
- [x] Create Tokyo Trip Camera Settings Spec (Moved) <!-- id: 99 -->
- [x] Create Interactive Tokyo Camera Page (Moved) <!-- id: 100 -->
- [x] Add Camera Shortcuts to World Map (Reverted) <!-- id: 101 -->

## Phase 1.5: MONTHLY RITUALS REFACTOR (CURRENT)
- [x] Optimize Spatial Level Startup (Reduce Scramble Delay) <!-- id: 9 -->
- [x] Standardize UI/UX (Remove iPad Frame, Fix Mobile Scaling) <!-- id: 8 -->
- [x] Standardize Game Viewport (Mobile Fullscreen vs Desktop Frame) <!-- id: 5 -->
- [x] Implement Responsive Camera (Auto-zoom on Mobile Landscape) <!-- id: 7 -->
- [x] Clean up internal navigation in Levels (Remove redundant Home buttons) <!-- id: 6 -->
- [x] Implement Monthly Stamp Card UI <!-- id: 1 -->
- [ ] Implement Daily Quest Generator Stub <!-- id: 103 -->
- [ ] Design "Lumi Hut" Decoration System (Concept) <!-- id: 104 -->
- [ ] Supabase Integration Plan (Data Schema Setup) <!-- id: 105 -->

## Verification
- [x] Verify Responsive Layout (iPad Landscape vs Mobile Portrait) <!-- id: 11 --> 
- [x] Verify 3D Interaction and "Zero-Instruction" cues <!-- id: 12 -->
- [x] Verify all animations (Breathing, Dashed Path, Scramble, Shake) <!-- id: 13 -->
