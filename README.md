# Savvy Saver v2.0.0

## 2️⃣ Overall Objective
Savvy Saver is a modern, responsive personal finance tracker designed to provide users with a clear and insightful overview of their financial health. It helps users manage their money by summarizing accounts, tracking spending trends, and visualizing data through interactive charts.

---
## Table of Contents

## 3️⃣ Features & Functionality

Savvy Saver offers a comprehensive suite of features to help users manage their finances effectively:

*   **Unified Dashboard:** Provides a central hub with a summary of total balance, individual account balances, spending trends, and recent transactions. The redesign includes enhanced charts and a cleaner layout.
*   **Account Management:** Dedicated pages for "Needs," "Wants", "Savings", and "Investments" allow users to track spending within specific financial categories. Each page utilizes a standardized layout with relevant charts and a filterable transaction list.
*   **Investments Tracking:** Manage investment goals and visualize portfolio allocation. The upgraded investments page includes goal progress tracking and an interactive allocation tool.
*   **Transaction Map**: A dedicated page to visualize transaction locations on an interactive map.
*   **Settings Customization:** Configure monthly salary and define budget allocations for "Needs," "Wants," and "Investments" with a real-time visual representation of the budget distribution.
*   **Streamlined Transaction Entry:** A multi-step modal simplifies adding new transactions. The modal includes fields for date, type, amount, account, category, and notes.

---

## 4️⃣ UI Elements & Design System

Savvy Saver features a modern and consistent user interface:

-   **Theme**: A premium, modern dark-mode UI is the primary theme.
-   **Colors**: The palette features a deep, nearly-black background (`#0d0c12`), high-contrast light text, and a vibrant neon/pinkish accent (`#e11d48`) for interactive elements, highlights, and active states.
-   **Glassmorphism**: Key UI elements like modals, cards, and popovers use a semi-transparent, blurred "frosted glass" effect. This is achieved with `bg-card/60`, `backdrop-blur-lg`, and similar Tailwind CSS classes.
-   **Layout**: The app uses a responsive, grid-based layout with consistent padding and spacing to ensure a clean and organized look on all devices.
-   **Unified Navigation:** Consistent navigation across the application for improved user experience.
-   **Style**: All elements feature soft, rounded corners and subtle drop shadows to create a sense of depth and elevation.
-   **Typography**: The app uses the 'Inter' sans-serif font for body text and headlines, and 'Source Code Pro' for code snippets, ensuring high readability.
-   **Interactivity**: Interactive elements provide clear feedback with a soft glow or border highlight on hover and focus states, with smooth, non-abrupt transitions powered by Framer Motion.
*   **Consistent Styling:** Application of the new design spec ensures a cohesive visual experience throughout the app.

---

## 5️⃣ Charts & Visualizations

The app utilizes various charts to visualize financial data:

*   **Spending Trend (Dashboard):** An area chart comparing monthly spending across Needs, Wants, and Investments categories.
*   **Balance Overview (Dashboard):** A pie chart showing the distribution of the total balance across all account types.
*   **Category Breakdown (Account Pages):** Pie charts displaying spending distribution by category for specific accounts.
*   **Spending Trend (Account Pages):** Line charts showing the total monthly spending trend for individual accounts.
*   **Portfolio Allocation (Investments):** A pie chart visualizing the user-defined Debt to Equity ratio.
*   **Budget Allocation (Settings):** A live pie chart showing the user's defined budget allocation.

---

## 6️⃣ Backend & Environments

-   **Firebase**: The app uses Firebase for backend services. The configuration is stored in `src/lib/firebase.ts`.
    ```javascript
    const firebaseConfig = {
      apiKey: "AIzaSyBfeXt8GhvrQiGDMGdZI2wCG1cYJoNjUGo",
      authDomain: "jntuacek-c4cf8.firebaseapp.com",
      databaseURL: "https://jntuacek-c4cf8-default-rtdb.firebaseio.com",
      projectId: "jntuacek-c4cf8",
      storageBucket: "jntuacek-c4cf8.appspot.com",
      messagingSenderId: "426214539597",
      appId: "1:426214539597:web:b8413548fbe2f5f94bf704",
      measurementId: "G-J2PF9JJRQG"
    };
    ```
-   **Firebase Realtime Database Design**:
    ```json
    {
      "users": {
        "userId": {
          "transactions": { "bucket": { "year": { "month": { "txId": { "date": "...", "type": "...", "amount": "...", "account": "...", "category": "...", "note": "..." } } } } },
          "settings": { "default": { "monthlySalary": "...", "needsPercentage": "...", "wantsPercentage": "...", "investmentsPercentage": "..." } },
          "goals": { "goalId": { "name": "...", "targetAmount": "...", "currentAmount": "..." } },
          "categories": { "Needs": [], "Wants": [], "Savings": [], "Investments": [] }
        }
      }
    }
    ```

---

## 8️⃣ Add Transaction Flow

-   **Modal UI**: A multi-step modal with a semi-transparent glassmorphism background.
-   **Steps**:
    1.  **Details**: Enter Date, Type (Credit/Debit), and Amount.
    2.  **Account**: Select an account from a card-based list.
    3.  **Category & Note**: Add a descriptive note and select a category.
-   **Validation**: Each step includes validation to ensure data integrity before proceeding.

---

## 9️⃣ Filters

-   **Functionality**: The app has robust filtering on all transaction-based pages.
-   **Category Dropdown**: Allows filtering transactions by one or more categories.
-   **Date Range Picker**: An integrated calendar for selecting custom date ranges with presets.
-   **Clear Filters**: A button to reset all active filters.

---

## 11️⃣ Errors & Edge Cases

-   **Hydration Errors**:
    -   **Issue**: The app experienced several React hydration errors (`Error: Hydration failed because the server rendered HTML didn't match the client.`).
    -   **Cause**: This was caused by components that relied on client-side state or browser APIs (like `window.matchMedia`) before hydration was complete.
    -   **Resolution**: Issues were resolved by refactoring components to be "client-aware," ensuring they only render client-specific views after mounting, thus preventing the mismatch.
-   **Chart Container Error**:
    -   **Issue**: Charts were throwing a `useChart must be used within a <ChartContainer />` error.
    -   **Cause**: The custom `ChartTooltip` was being used on charts that were not wrapped by the required `ChartContainer` component.
    -   **Resolution**: The charts on the Dashboard and Account pages were wrapped in a `ChartContainer` with the appropriate configuration, resolving the error.
- **Map Initialization Errors**:
    - **Issue**: The map components were throwing initialization and "window not defined" errors.
    - **Cause**: These libraries directly manipulate the DOM and are not compatible with Next.js's Server-Side Rendering (SSR).
    - **Resolution**: The map component is now loaded using `next/dynamic` with `ssr: false` to ensure it only renders on the client-side, completely avoiding SSR-related issues.

---
## 12️⃣ Advice & Notes

-   **Charting Library**: The application currently uses `recharts`, which is the default for `shadcn/ui` charts. 
-   **Component Library**: Continue to use `shadcn/ui` components where possible to maintain a consistent design system.
-   **Styling**: Use the `cn` utility function from `src/lib/utils.ts` for combining and managing Tailwind CSS classes.

---

## 13️⃣ Versioning & Changelog

-   **v1.0.0 (Initial Version)**
    -   Initial project setup with Next.js, React, Tailwind CSS.
    -   Basic app shell with a sidebar and main content area.
    -   Placeholder pages for Dashboard, Accounts, Investments, and Settings.
-   **v2.0.0 (Static Conversion)**:
    -   **Static Conversion**: Converted the app to a fully client-side static application. All server-side logic, including AI features, has been removed to ensure compatibility with static hosting platforms.
    -   **New Map Feature**: Replaced the previous Support/Analytics page with an interactive `/maps` page to visualize transaction locations.
    -   **Firebase Integration**: Connected the app to Firebase Realtime Database for live data synchronization. Added data seeding and clearing functionality.
    -   **UI Overhaul**: Implemented a new dark theme with a pinkish-neon accent and applied glassmorphism effects.
    -   **Dashboard Redesign**: Added `BucketSummaryCard`, `SpendingChart`, `GoalsOverview`, and `TopSpendingCategories` to the dashboard.
    -   **Bug Fixes**: Resolved multiple hydration errors, chart container errors, module import errors, and map initialization errors.
