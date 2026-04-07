# tesnet.cwt.swap - Mobile App Design Plan

## Overview

**tesnet.cwt.swap** is a mobile token swap application built on a local blockchain simulation. Users can swap between 7 different tokens (USDC, USDT, ETH, BTC, NEX, DOGE, HYPE) using an Automated Market Maker (AMM), view exchange rates, and track their transaction history.

---

## Screen List

1. **Home / Swap Screen** - Primary interface for token swapping
2. **Token Selector Modal** - Select input/output tokens
3. **Swap Confirmation Sheet** - Review swap details before execution
4. **Transaction History** - View past swaps and transfers
5. **Settings Screen** - App preferences and account info

---

## Primary Content and Functionality

### 1. Home / Swap Screen
**Purpose:** Main interface where users perform token swaps

**Content:**
- Header with app title and settings icon
- **Input Section:**
  - "From" token selector (displays selected token + icon)
  - Input amount field (numeric keyboard)
  - "Max" button to use available balance
  - Current balance display
- **Swap Button** (prominent, centered)
- **Output Section:**
  - "To" token selector (displays selected token + icon)
  - Output amount display (read-only, updates as user types)
  - Estimated output with exchange rate info
- **Rate Info Card:**
  - Current exchange rate (e.g., "1 NEX = 0.909 ETH")
  - Refresh button to get latest quote
- **Recent Swaps** - Quick access to last 3 swaps

**Functionality:**
- Tap "From" token → Token Selector Modal
- Tap "To" token → Token Selector Modal
- Type amount → Auto-fetch quote from API
- Tap "Max" → Fill with available balance
- Tap Swap Button → Swap Confirmation Sheet
- Pull-to-refresh rate info

### 2. Token Selector Modal
**Purpose:** Choose tokens for swap

**Content:**
- Search bar to filter tokens
- List of 7 available tokens with icons and symbols
- Checkmark on currently selected token
- Divider between input/output selection modes

**Functionality:**
- Search filters tokens by name/symbol
- Tap token → Select and close modal
- Smooth scroll if list exceeds screen

### 3. Swap Confirmation Sheet
**Purpose:** Review and confirm swap details

**Content:**
- "Confirm Swap" header
- **Swap Summary:**
  - "You send: X NEX"
  - "You receive: Y ETH"
  - Exchange rate breakdown
  - Estimated output amount
- **Fees Section** (if applicable)
- **Confirm Button** (primary, full-width)
- **Cancel Button** (secondary)

**Functionality:**
- Confirm → Execute swap via API
- Show loading state during transaction
- Success/error feedback with haptic feedback
- Navigate to history on success

### 4. Transaction History Screen
**Purpose:** View all past transactions

**Content:**
- List of transactions (newest first)
- Each transaction card shows:
  - Token pair (NEX → ETH)
  - Amount sent and received
  - Timestamp
  - Status (success/pending)
- Pull-to-refresh
- Empty state if no transactions

**Functionality:**
- Tap transaction → Show details modal
- Pull-to-refresh fetches latest blocks
- Filter by date (optional enhancement)

### 5. Settings Screen
**Purpose:** App configuration and info

**Content:**
- **Account Section:**
  - Current account ID (read-only)
  - Account balance summary
- **App Info:**
  - App version
  - About tesnet.cwt.swap
- **Theme Toggle** (light/dark mode)
- **Reset Data** button (clears local cache)

**Functionality:**
- Toggle dark/light mode
- Copy account ID to clipboard
- Reset app data with confirmation

---

## Key User Flows

### Flow 1: Perform a Token Swap
1. User opens app → Home screen displays
2. Taps "From" token selector → Modal opens
3. Selects NEX token → Modal closes, NEX selected
4. Enters amount "10" → Quote fetches automatically
5. Taps "To" token selector → Modal opens
6. Selects ETH token → Modal closes, ETH selected
7. Sees output amount "9.09 ETH"
8. Taps "Swap" button → Confirmation sheet appears
9. Reviews details and taps "Confirm"
10. Transaction submitted → Loading spinner
11. Success message → Auto-navigate to History
12. Transaction appears in history with timestamp

### Flow 2: View Transaction History
1. User taps "History" tab
2. Sees list of past swaps with details
3. Taps a transaction → Details modal shows full info
4. Swipes down to close modal
5. Pulls down to refresh → Latest blocks fetched

### Flow 3: Check Exchange Rate
1. User on Home screen
2. Sees current rate card (e.g., "1 NEX = 0.909 ETH")
3. Taps refresh icon → Fetches new quote
4. Rate updates with timestamp

---

## Color Choices

### Brand Colors
- **Primary (Accent):** `#0a7ea4` - Modern teal/cyan (swap action, highlights)
- **Background:** `#ffffff` (light) / `#151718` (dark)
- **Surface:** `#f5f5f5` (light) / `#1e2022` (dark) - Cards, inputs
- **Foreground:** `#11181C` (light) / `#ECEDEE` (dark) - Primary text
- **Muted:** `#687076` (light) / `#9BA1A6` (dark) - Secondary text
- **Border:** `#E5E7EB` (light) / `#334155` (dark) - Dividers, input borders
- **Success:** `#22C55E` - Transaction success
- **Warning:** `#F59E0B` - Pending transactions
- **Error:** `#EF4444` - Failed transactions

### Token Colors (for visual distinction)
- NEX: `#9945FF` (Purple)
- ETH: `#627EEA` (Blue)
- BTC: `#F7931A` (Orange)
- USDC: `#2775CA` (Dark Blue)
- USDT: `#26A17B` (Green)
- DOGE: `#BA9F33` (Gold)
- HYPE: `#FF6B6B` (Red)

---

## Design Principles

1. **Mobile-First:** Optimized for portrait orientation (9:16), one-handed usage
2. **Apple HIG Compliance:** Follows iOS design standards for buttons, spacing, and interactions
3. **Clear Information Hierarchy:** Swap input/output prominently, secondary info below
4. **Immediate Feedback:** Loading states, haptic feedback on actions
5. **Accessibility:** High contrast, readable font sizes, clear touch targets (min 44pt)
6. **Consistency:** Unified color palette, consistent spacing (8pt grid), reusable components

---

## Component Library

- **ScreenContainer:** SafeArea wrapper for all screens
- **TokenCard:** Displays token symbol, icon, and balance
- **SwapButton:** Primary action button with loading state
- **TransactionCard:** Shows swap details in history
- **RateCard:** Displays current exchange rate
- **ConfirmationSheet:** Bottom sheet for swap review
- **TokenModal:** Searchable token selector

---

## Navigation Structure

```
Root Layout
├── (tabs)
│   ├── index.tsx (Home / Swap)
│   ├── history.tsx (Transaction History)
│   └── settings.tsx (Settings)
└── Modals
    ├── token-selector.tsx
    ├── swap-confirmation.tsx
    └── transaction-detail.tsx
```

---

## Responsive Considerations

- **Portrait Only:** App locked to portrait orientation
- **Safe Area:** Handles notch, home indicator, and tab bar
- **Text Scaling:** Respects system font size preferences
- **Touch Targets:** Minimum 44pt for interactive elements
- **Keyboard Handling:** Input fields push content up on focus

---

## Performance Targets

- **App Launch:** < 2 seconds
- **Quote Fetch:** < 500ms
- **Swap Submission:** < 1 second
- **History Load:** < 1 second
- **Smooth Scroll:** 60 FPS on mid-range devices

---

## Accessibility Features

- High contrast text (WCAG AA compliant)
- Descriptive button labels
- Haptic feedback for actions
- Screen reader support
- Keyboard navigation support
- Color-blind friendly token icons (symbols + colors)

