
# 1️⃣ Savvy Saver v2.0.0

## 2️⃣ Overall Objective
Savvy Saver is a powerful, multi-purpose application designed to provide a comprehensive overview of a user's personal finances. It offers a centralized hub for managing money, tracking spending, and visualizing financial health through interactive charts and maps.

---

## 3️⃣ Feature List

### Finance Module
-   **Dashboard**: A comprehensive overview of the user's financial status. It summarizes total balance and balances for individual account types (Needs, Wants, Savings, Investments). Features a main spending trend area chart, a balance overview pie chart, a list of recent transactions, and a chart for top spending categories.
-   **Account Detail Pages (Needs, Wants, Savings, Investments)**: Each account page provides a dedicated view with a category breakdown pie chart, a spending trend line chart, and a filterable list of all transactions for that specific account.
-   **Maps Page**: A dedicated dashboard for visualizing geolocated transactions on an interactive map.
-   **Settings Page**: Allows users to set their monthly salary and define their budget by allocating percentages to Needs, Wants, and Investments. The Savings percentage is calculated automatically, and the allocation is visualized with a live pie chart. Includes data management tools to seed or clear the database.
-   **Add Transaction Modal**: A floating action button opens a sleek, multi-step modal for adding new transactions.

---

## 4️⃣ Design & UI Language

-   **Theme**: A premium, modern dark-mode UI is the primary theme, with a clean light-mode variant. The default is set to the user's system preference.
-   **Colors**: The palette features a deep, nearly-black background with a subtle radial gradient for depth (`#0d0c12`). High-contrast light text ensures readability. A vibrant gradient from pink (`#e11d48`) to purple (`#9333ea`) is used for primary actions, accents, and highlights.
-   **Glassmorphism**: Key UI elements like modals and cards use a semi-transparent, blurred "frosted glass" effect. This is achieved with `bg-card/60`, `backdrop-blur-lg`, and similar Tailwind CSS classes.
-   **Layout**: The app uses a responsive, grid-based layout with consistent padding and spacing to ensure a clean and organized look on all devices. The main content area scrolls independently of the fixed sidebar.
-   **Style**: All elements feature soft, rounded corners (`rounded-2xl`) and subtle drop shadows to create a sense of depth and elevation.
-   **Typography**: The app uses the 'Inter' sans-serif font for body text and headlines, and 'Source Code Pro' for code snippets, ensuring high readability.
-   **Interactivity**: Interactive elements provide clear feedback with a soft glow or border highlight on hover and focus states, with smooth, non-abrupt transitions powered by Framer Motion.

---

## 5️⃣ Backend & Environments

-   **Firebase**: The app uses Firebase for backend services, specifically the Realtime Database. All data fetching is done on the client-side.

---

## 6️⃣ Versioning & Changelog

-   **v2.0.0 (Current)**
    -   **Static Conversion**: Converted the app to a fully client-side static application. All server-side logic has been removed to ensure compatibility with static hosting platforms like Firebase Hosting's free tier.
    -   **New Map Feature**: Added an interactive `/maps` page to visualize transaction locations.
    -   **Unified Navigation**: Updated the main sidebar and mobile navigation.
    -   **Consistent Styling**: Re-created all components using the modern glassmorphism theme to ensure a cohesive visual experience.
