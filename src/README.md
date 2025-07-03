# 1️⃣ Savvy Saver v1.0.0

## 2️⃣ Overall Objective
Savvy Saver is a modern, responsive personal finance tracker designed to provide users with a clear and insightful overview of their financial health. It helps users manage their money by summarizing accounts, tracking spending trends, visualizing data through interactive charts, and offering personalized insights via an integrated AI assistant.

---

## 3️⃣ Feature List

-   **Dashboard**: A comprehensive overview of the user's financial status. It summarizes total balance and balances for individual account types (Needs, Wants, Savings, Investments). Features a main spending trend area chart, a balance overview pie chart, a list of recent transactions, a chart for top spending categories, a "Magic Calendar" for drilling down into daily transactions, and an overview of financial goals.
-   **Account Detail Pages (Needs, Wants, Savings)**: Each account page provides a dedicated view with a category breakdown pie chart, a spending trend line chart, and a filterable list of all transactions for that specific account.
-   **Investments Page**: Tracks investment goals and portfolio allocation. Includes transaction history, goal progress bars, an investment growth chart, and a portfolio allocation tool with sliders and a live-updating pie chart.
-   **Visualizer AI**: A chat-based assistant that can answer questions about finances, generate charts, and provide summaries. The interface features a welcome card to guide new users.
-   **Settings Page**: Allows users to set their monthly salary and define their budget by allocating percentages to Needs, Wants, and Investments. The Savings percentage is calculated automatically, and the allocation is visualized with a live pie chart. Includes data management tools to seed or clear the database.
-   **Add Transaction Modal**: A floating action button (and a button in the sidebar) opens a sleek, multi-step modal for adding new transactions with fields for type, amount, date, account, category, and notes.

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
-   **Top Spending Categories (Dashboard)**
    -   **Location**: Dashboard Page
    -   **Type**: Vertical Bar Chart
    -   **Data**: Displays the top 5 spending categories across all accounts.
-   **Category Breakdown (Account Pages)**
    -   **Location**: Needs, Wants, Savings Pages
    -   **Type**: Pie Chart
    -   **Data**: Displays spending distribution by category for the specific account being viewed.
-   **Spending Trend (Account Pages)**
    -   **Location**: Needs, Wants, Savings Pages
    -   **Type**: Line Chart
    -   **Data**: Shows the total monthly spending trend for the specific account.
-   **Investment Growth (Investments Page)**
    -   **Location**: Investments Page
    -   **Type**: Line Chart
    -   **Data**: Shows the cumulative growth of investment contributions over time.
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

-   **Theme**: A premium, modern dark-mode UI is the primary theme, with a clean light-mode variant. The default is set to the user's system preference.
-   **Colors**: The palette features a deep, nearly-black background with a subtle radial gradient for depth (`#0d0c12`). High-contrast light text ensures readability. A vibrant gradient from pink (`#e11d48`) to purple (`#9333ea`) is used for primary actions, accents, and highlights.
-   **Glassmorphism**: Key UI elements like modals and cards use a semi-transparent, blurred "frosted glass" effect. This is achieved with `bg-card/60`, `backdrop-blur-lg`, and similar Tailwind CSS classes.
-   **Layout**: The app uses a responsive, grid-based layout with consistent padding and spacing to ensure a clean and organized look on all devices. The main content area scrolls independently of the fixed sidebar.
-   **Style**: All elements feature soft, rounded corners (`rounded-2xl`) and subtle drop shadows to create a sense of depth and elevation.
-   **Typography**: The app uses the 'Inter' sans-serif font for body text and headlines, and 'Source Code Pro' for code snippets, ensuring high readability.
-   **Interactivity**: Interactive elements provide clear feedback with a soft glow or border highlight on hover and focus states, with smooth, non-abrupt transitions powered by Framer Motion.

---

## 6️⃣ Backend & Environments

-   **Firebase**: The app uses Firebase for backend services. The configuration is stored in `src/lib/firebase.ts`.
-   **Firebase Realtime Database Design**: The database uses a hierarchical structure for efficient querying.
    ```json
    {
      "users": {
        "userId": {
          "transactions": {
            "Needs": { "2025": { "07": { "02": { "txnId1": { "...details" } }}}},
            "Wants": { "...": {} },
            "Savings": { "...": {} },
            "Investments": { "...": {} }
          },
          "goals": { "goalId1": { "name": "...", "targetAmount": "...", "currentAmount": "..." } },
          "settings": { "salary": "...", "needsPercentage": "...", "wantsPercentage": "...", "investmentsPercentage": "..." },
          "aiHistory": { "promptId1": { "prompt": "...", "response": "..." } }
        }
      }
    }
    ```
-   **Genkit**: AI functionality is powered by Genkit, configured to use Google AI's `gemini-2.0-flash` model.

---

## 7️⃣ AI Assistant Features

-   **Live Data Integration**: The AI Assistant is fully integrated with Firebase Realtime Database, allowing it to fetch and analyze a user's live financial data to provide up-to-date, accurate answers.
-   **Core Capabilities**:
    -   Can summarize spending, income, and account balances.
    -   Can analyze transactions by date, category, or account.
    -   Can track progress towards financial goals.
-   **Natural Language Questions**: Can understand and process complex natural language questions.
-   **Dynamic Responses**: The AI can generate responses in various formats, including clear text summaries and well-formatted Markdown tables.

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

-   **Functionality**: Robust filtering is available on all account detail pages.
-   **Controls**: Includes a category dropdown, a date range picker with presets, a search input for notes, and a toggle for transaction type (All/Credit/Debit).
-   **UX**: Filters are housed within a collapsible section for a clean interface.

---

## 10️⃣ Smart Calendar

-   **Functionality**: The `Magic Calendar` on the dashboard allows users to explore their financial history visually.
-   **Behavior**: Days with transactions are visually highlighted. Clicking any date opens a modal displaying a focused list of only that day's transactions.

---

## 11️⃣ Errors & Edge Cases

-   **Hydration Errors**: Resolved multiple React hydration errors by ensuring chart components render only on the client-side and by correcting component composition issues (`DialogTrigger` outside `Dialog`).
-   **Chart Container Error**: Resolved a `useChart must be used within a <ChartContainer />` error by ensuring all charts using custom tooltips are properly wrapped.
-   **Module Not Found / Reference Errors**: Fixed build-time and runtime errors caused by incorrect import paths or missing imports.

---

## 12️⃣ Versioning & Changelog

-   **v1.0.0 (Current)**
    -   **UI Overhaul**: Implemented a new dark theme with a pink/purple gradient accent. Applied glassmorphism effects to all cards, modals, and popups.
    -   **Dashboard Redesign**: Rebuilt the dashboard to cohesively display all financial widgets: Total Balance, Spending Chart, Balance Overview, Recent Transactions, Top Spending Categories, Magic Calendar, and a new Goals Overview.
    -   **Navigation Fix**: Corrected sidebar and mobile navigation to use appropriate links for the finance application.
    -   **Code Refactoring**: Removed all obsolete CRM-related components and consolidated UI logic for a cleaner, more maintainable codebase.
    -   **Firebase Integration**: Connected the app to Firebase Realtime Database for live data synchronization. Added data seeding and clearing functionality.
    -   **AI Upgrade**: Transformed the AI into a `financialAssistant` that uses tools to fetch and analyze live data from Firebase, providing conversational and data-rich responses.
