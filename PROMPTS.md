# AI Chat Logs & Interaction History (PROMPTS.md)

This document contains the chronological record of AI developer interactions, architecture planning, and prompts executed during the development of the **Car Dealership Inventory System**.

---

## Session 1: Requirements Breakdown & Architectural Planning

### User Prompt:
> *"Analyze the AI Kata Car Dealership Inventory System specification (V2). Architect an end-to-end full-stack solution with a TDD commit workflow (Red-Green-Refactor). Ensure the frontend follows a bespoke editorial luxury aesthetic (calm, warm tones, high attention to typography and micro-interactions) rather than a generic boilerplate design, and ensure all inventory edge cases such as concurrency and zero-stock guards are handled."*

### AI Assistant Analysis & Clarification:
- Analyzed `AI_Kata_Car_Dealership_Inventory_System_V2.pdf`.
- Clarified repository creation location and backend technology stack choice (Node.js/TypeScript + Express + SQLite, React 19 + Tailwind CSS SPA).
- Planned TDD workflow adhering to the Red-Green-Refactor development lifecycle with Git co-authorship tags.

---

## Session 2: TDD Test Specifications & Schema Design

### Prompt:
> *"Draft the core data models and strict unit/integration tests covering JWT auth, vehicle CRUD, multi-criteria search, atomic purchase decrement, and admin-only restock restrictions before writing application logic."*

### Generated Test Suites:
- `backend/tests/auth.test.ts`: User registration, email uniqueness, password hashing verification, and JWT login tests.
- `backend/tests/vehicles.test.ts`: Protected vehicle listing, search by make, category, and price range, vehicle creation validation, updates, and admin-only deletion.
- `backend/tests/inventory.test.ts`: Purchase atomic quantity reduction, zero-stock rejection, and admin-only restocking validation.

---

## Session 3: Controller & Service Implementation (GREEN Phase)

### Prompt:
> *"Implement Express routers, JWT middleware with RBAC guards, SQLite data repositories with WAL mode, and atomic database transactions using better-sqlite3 to turn all 23 failing test cases green."*

### Implemented Files:
- `backend/src/middleware/auth.middleware.ts`: Bearer token extraction, JWT verification, `requireAuth`, and `requireAdmin` guards.
- `backend/src/repositories/vehicle.repository.ts`: SQLite transaction-wrapped purchase and restock methods preventing race conditions.
- `backend/src/controllers/vehicle.controller.ts` & `backend/src/controllers/auth.controller.ts`.

---

## Session 4: Refactoring & Input Validation (REFACTOR Phase)

### Prompt:
> *"Decouple request payload validation using Zod schemas for both auth and vehicle controllers, ensuring strict positive integers for stock and non-negative numbers for prices, while keeping 100% test pass rate."*

### Implemented Files:
- `backend/src/validators/auth.validator.ts`
- `backend/src/validators/vehicle.validator.ts`

---

## Session 5: Frontend SPA Design & Implementation

### Prompt:
> *"Design a luxury editorial frontend with a soft, calm aesthetic (warm stone palette, no harsh AI neon gradients, smooth spring easing). Include live search, price range filter, stock badges, zero-stock disabled purchase button, acquisition receipt modal, and 1-click Buyer/Admin demo switchers."*

### Implemented Files:
- `frontend/src/context/AuthContext.tsx` & `InventoryContext.tsx`
- `frontend/src/components/Navbar.tsx`, `HeroSection.tsx`, `FilterBar.tsx`, `VehicleGrid.tsx`, `VehicleCard.tsx`, `PurchaseModal.tsx`, `AdminRestockModal.tsx`, `AdminVehicleModal.tsx`, `AuthModal.tsx`, `PurchaseHistoryModal.tsx`, `Toast.tsx`.

---

## Session 6: Verification, Screenshot Capture, & Documentation

### Prompt:
> *"Launch both backend and frontend servers, perform browser automation testing across buyer purchase and admin restock workflows, capture production screenshots, and draft a comprehensive README.md meeting all assignment deliverables."*
