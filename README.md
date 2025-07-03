# 1️⃣ FinanceFlow v1.0.0

## 2️⃣ Overall Objective
FinanceFlow is a modern, responsive personal finance tracker designed to provide users with a clear and insightful overview of their financial health. It helps users manage their money by summarizing accounts, tracking spending trends, visualizing data through interactive charts, and offering personalized insights via an integrated AI assistant.

---

## 3️⃣ Feature List

-   **Dashboard**: Summarizes total balance and balances for individual account types. Features a spending trend area chart and a balance overview pie chart. Displays a list of recent transactions.
-   **Account Detail Pages (Needs, Wants, Savings)**: Each account page provides a dedicated view with a category breakdown pie chart, a spending trend line chart, and a filterable list of transactions for that specific account.
-   **Investments Page**: Tracks investment goals and portfolio allocation. Includes transaction history, goal progress bars, and a portfolio allocation tool with sliders and a live-updating pie chart.
-   **Visualizer AI**: A chat-based assistant that can answer questions about finances, generate charts, and provide summaries. The interface features a welcome card to guide new users.
-   **Settings Page**: Allows users to set their monthly salary and define their budget by allocating percentages to Needs, Wants, and Investments. The Savings percentage is calculated automatically, and the allocation is visualized with a live pie chart.
-   **Add Transaction Modal**: A floating action button opens a sleek, multi-step modal for adding new transactions with fields for type, amount, date, account, category, and notes.

---

## 4️⃣ Charts & Visualizations

-   **Spending Trend (Dashboard)**
    -   **Location**: Dashboard Page
    -   **Type**: Area Chart
    -   **Data**: Compares monthly spending across Needs, Wants, and Investments categories.
    -   **Style**: Stacked areas with gradient fills and smooth, curved lines.
-   **Balance Overview (Dashboard)**
    -   **Location**: Dashboard Page
    -   **Type**: Pie Chart
    -   **Data**: Shows the distribution of the total balance across all account types (Needs, Wants, Savings, Investments).
-   **Category Breakdown (Account Pages)**
    -   **Location**: Needs, Wants, Savings Pages
    -   **Type**: Pie Chart
    -   **Data**: Displays spending distribution by category for the specific account being viewed.
-   **Spending Trend (Account Pages)**
    -   **Location**: Needs, Wants, Savings Pages
    -   **Type**: Line Chart
    -   **Data**: Shows the total monthly spending trend for the specific account.
-   **Portfolio Allocation (Investments)**
    -   **Location**: Investments Page
    -   **Type**: Pie Chart
    -   **Data**: Visualizes the user-defined Debt to Equity ratio from the allocation sliders.
-   **Budget Allocation (Settings)**
    -   **Location**: Settings Page
    -   **Type**: Pie Chart
    -   **Data**: Provides a live visualization of the user's defined budget allocation as they adjust the sliders.

---

## 5️⃣ Design & UI Language

-   **Theme**: A premium, modern dark-mode UI is the primary theme.
-   **Colors**: The palette features a deep, nearly-black background (`#0d0c12`), high-contrast light text, and a vibrant neon/pinkish accent (`#e11d48`) for interactive elements, highlights, and active states.
-   **Glassmorphism**: Key UI elements like modals, cards, and popovers use a semi-transparent, blurred "frosted glass" effect. This is achieved with `bg-card/60`, `backdrop-blur-lg`, and similar Tailwind CSS classes.
-   **Layout**: The app uses a responsive, grid-based layout with consistent padding and spacing to ensure a clean and organized look on all devices.
-   **Style**: All elements feature soft, rounded corners and subtle drop shadows to create a sense of depth and elevation.
-   **Typography**: The app uses the 'Inter' sans-serif font for body text and headlines, and 'Source Code Pro' for code snippets, ensuring high readability.
-   **Interactivity**: Interactive elements provide clear feedback with a soft glow or border highlight on hover and focus states, with smooth, non-abrupt transitions.

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
          "transactions": { "...": { "date": "...", "type": "...", "amount": "...", "account": "...", "category": "...", "note": "..." } },
          "settings": { "salary": "...", "needsPercentage": "...", "wantsPercentage": "...", "investmentsPercentage": "..." },
          "goals": { "...": { "name": "...", "targetAmount": "...", "savedAmount": "..." } },
          "aiHistory": { "...": { "prompt": "...", "response": "..." } }
        }
      }
    }
    ```
-   **Genkit**: AI functionality is powered by Genkit, configured to use Google AI's `gemini-2.0-flash` model.

---

## 7️⃣ AI Assistant Features

-   **Live Data Integration**: The AI Assistant is fully integrated with Firebase Realtime Database, allowing it to fetch and analyze a user's live financial data to provide up-to-date, accurate answers.
-   **Comprehensive Data Awareness**: The assistant is aware of all user data, including transactions, goals, and budget settings. It can handle a wide range of conversational queries.
-   **Core Capabilities**:
    -   **Summaries**: Can summarize total spending, income, net balance, and spending breakdowns by category, account, or time period.
    -   **Transaction Analysis**: Provides date-wise or month-wise transaction lists and can identify the highest or lowest spending categories.
    -   **Goal Tracking**: Lists all financial goals, showing target amounts, current saved amounts, and progress percentages.
    -   **Budget & Savings**: Computes savings allocations based on the user's defined salary and budget percentages.
-   **Natural Language Questions**: Can understand and process complex natural language questions like:
    -   *"How much did I spend on Entertainment last month?"*
    -   *"List my transactions in June."*
    -   *"What's my Needs balance?"*
    -   *"How close am I to completing my Emergency Fund goal?"*
-   **Dynamic Responses**: The AI can generate responses in various formats to best suit the user's query, including:
    -   Clear text summaries.
    -   Well-formatted Markdown tables.
-   **Conversational Context**:
    -   Maintains chat history to understand follow-up questions and provide contextually relevant answers.
    -   If a query is ambiguous, it will ask for clarification.
-   **User Experience**:
    -   Features a persistent, scrollable chat history.
    -   Includes friendly, natural language responses.
    -   Provides graceful error messages if data is missing or a question cannot be answered.
-   **Underlying Tools**: The AI uses a set of tools to interact with Firebase data, including `getTransactionsTool`, `getGoalsTool`, `getSettingsTool`, and `getAccountsTool`.

---

## 8️⃣ Add Transaction Flow

-   **Modal UI**: A multi-step modal with a semi-transparent glassmorphism background.
-   **Steps**:
    1.  **Details**: Enter Date, Type (Credit/Debit), and Amount.
    2.  **Account**: Select an account from a card-based list.
    3.  **Category & Note**: Add a descriptive note and select a category.
-   **Buttons**: Includes a "Suggest" button for AI-powered category suggestions and a "Manage" button for editing categories.
-   **Validation**: Each step includes validation to ensure data integrity before proceeding.

---

## 9️⃣ Filters

-   **Functionality (Planned)**: The UI specification calls for robust filtering on all transaction-based pages.
-   **Category Dropdown**: Allows filtering transactions by one or more categories.
-   **Date Range Picker**: An integrated calendar for selecting custom date ranges.
-   **Clear Filters**: A button to reset all active filters.

---

## 10️⃣ Smart Calendar

-   **Functionality (Planned)**: A future feature will include a smart calendar view.
-   **Behavior**: Days will be visually shaded based on whether spending was over or under a defined daily budget. Users will be able to drag to select date ranges for analysis.

---

## 11️⃣ Errors & Edge Cases

-   **Hydration Errors**:
    -   **Issue**: The app experienced several React hydration errors (`Error: Hydration failed because the server rendered HTML didn't match the client.`).
    -   **Cause**: This was caused by components like the `Sidebar` that relied on the `useIsMobile` hook. The server, having no concept of screen size, would render a different initial HTML than the client, causing a mismatch.
    -   **Resolution**: The issue was resolved by refactoring the components to be "client-aware." They now render a default (desktop) state on the server and only render the mobile-specific view after the component has safely mounted on the client, thus preventing the mismatch.
-   **Chart Container Error**:
    -   **Issue**: Charts were throwing a `useChart must be used within a <ChartContainer />` error.
    -   **Cause**: The custom `ChartTooltip` was being used on charts that were not wrapped by the required `ChartContainer` component.
    -   **Resolution**: The charts on the Dashboard and Account pages were wrapped in a `ChartContainer` with the appropriate configuration, resolving the error.
- **Module Not Found Error**:
    - **Issue**: A build error occurred (`Module not found: Can't resolve '../ui/avatar'`).
    - **Cause**: An incorrect relative path was used to import the `Avatar` component.
    - **Resolution**: The import path was corrected to use the `@/components/ui/avatar` alias.

---

## 12️⃣ Advice & Notes

-   **Charting Library**: The application currently uses `recharts`, which is the default for `shadcn/ui` charts. The UI specification mentions `Chart.js`. A decision should be made whether to stick with `recharts` for consistency or migrate to `Chart.js`.
-   **Component Library**: Continue to use `shadcn/ui` components where possible to maintain a consistent design system.
-   **Styling**: Use the `cn` utility function from `src/lib/utils.ts` for combining and managing Tailwind CSS classes.

---

## 13️⃣ Versioning & Changelog

-   **v1.0.0 (Initial Version)**
    -   Initial project setup with Next.js, React, Tailwind CSS, and Genkit.
    -   Basic app shell with a sidebar and main content area.
    -   Placeholder pages for Dashboard, Accounts, Investments, Visualizer, and Settings.
-   **Changelog (Recent Updates)**:
    -   **UI Overhaul**: Implemented a new dark theme with a pinkish-neon accent. Applied glassmorphism effects to all cards, modals, and popups for a consistent, modern look.
    -   **Dashboard Redesign**: Added `BalanceOverview` and `SpendingChart` to the dashboard.
    -   **Account Page Layout**: Created a standardized `AccountPageLayout` with charts, now used by Needs, Wants, and Savings pages.
    -   **Investments Upgrade**: Added `PortfolioAllocation` and `GoalProgress` components.
    -   **Bug Fixes**: Resolved multiple hydration errors, a chart container error, and a module import error.
    -   **Layout Fix**: Corrected sidebar layout issues to prevent the main content from overlapping with the sidebar.
    -   **Firebase Integration**: Connected the app to Firebase Realtime Database for live data synchronization. Added data seeding and clearing functionality.
    -   **AI Upgrade**: Transformed the AI into a `financialAssistant` that uses tools to fetch and analyze live data from Firebase, providing conversational and data-rich responses.
