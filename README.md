# Solana Security Dashboard

## Introduction

This project is an open-source dashboard designed to track security exploits and incidents within the Solana ecosystem. It provides a live-updating view of known exploits, drawing inspiration from the original Superteam Security handbook and aiming to fulfill the requirements of the associated Superteam Earn bounty. The dashboard fetches data automatically and allows community contributions for new or missing exploit information.

## Features

- **Exploit Table:** Displays a sortable and filterable list of known Solana security exploits.
- **Aggregate Statistics:** Shows key metrics like total exploits tracked, total funds lost, and recovery rate.
- **Automated Polling:** Periodically checks external data sources (Flipside Crypto or Helius) for new or updated exploit information.
- **Manual Trigger:** Allows manually forcing a data poll.
- **User Submissions:** Provides a form for users to submit details about exploits not yet listed.

## Tech Stack

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **API:** tRPC (for type-safe client-server communication)
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, Sonner (for notifications)
- **Data Sources:** Flipside Crypto API/SDK, Helius API (selectable via env var)
- **Package Manager:** pnpm

## Project Structure

- `prisma/`: Contains the database schema (`schema.prisma`) and migrations.
- `src/app/`: Next.js App Router pages (frontend UI).
  - `_components/`: React components used within the app pages.
  - `layout.tsx`: Root layout component.
  - `page.tsx`: Main dashboard page component.
  - `submit/page.tsx`: Exploit submission page component.
- `src/components/`: Shared UI components (primarily Shadcn UI).
- `src/lib/`: Core application logic and utilities.
  - `exploits/`: Logic related to fetching and handling exploit data.
    - `providers.ts`: Implementations for fetching data from Flipside/Helius.
    - `polling.ts`: The background service for automatic data fetching.
  - `logger.ts`: Simple logging utility.
- `src/server/`: Backend tRPC API implementation.
  - `api/`: tRPC router definitions.
    - `root.ts`: Main app router combining other routers.
    - `routers/`: Specific routers (`exploits.ts`, `submissions.ts`).
    - `trpc.ts`: tRPC server setup.
  - `db.ts`: Prisma client initialization.
- `src/styles/`: Global CSS styles.
- `src/trpc/`: tRPC client setup (`react.tsx`, `server.ts`).

## Setup Instructions

1.  **Clone Repository:**

    ```bash
    git clone <repository-url>
    cd solana-security-dashboard
    ```

2.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

3.  **Database Setup:**

    - Ensure you have PostgreSQL running.
    - Create a database (e.g., `solsecdb`).
    - Copy the example environment file: `cp .env.example .env`

4.  **Environment Variables (`.env`):**
    Edit the `.env` file and provide values for the following:

    - `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`).
    - `NODE_ENV`: Set to `development` for local work or `production` for deployment.
    - `FLIPSIDE_API_KEY`: Your API key from Flipside Crypto (required if using Flipside as the provider).
    - `HELIUS_API_KEY`: Your API key from Helius (required if using Helius as the provider).
    - `EXPLOIT_DATA_PROVIDER`: Choose the data source. Set to `flipside` or `helius` (defaults to `flipside` if omitted or invalid).
    - `EXPLOIT_POLL_INTERVAL`: Optional. Interval in minutes for automatic polling (defaults to `15`).

5.  **Prisma Setup:**
    - Generate the Prisma client:
      ```bash
      pnpm prisma generate
      ```
    - Apply the schema to your database. For development:
      ```bash
      pnpm prisma db push
      ```
    - For production or more controlled environments, use migrations:
      ```bash
      # Create a migration (if you make schema changes)
      pnpm prisma migrate dev --name your_migration_name
      # Apply migrations during deployment
      pnpm prisma migrate deploy
      ```

## Running the Project

- **Development Server:**

  ```bash
  pnpm dev
  ```

  This starts the Next.js development server, typically on `http://localhost:3000`.

- **Production Build:**

  ```bash
  pnpm build
  ```

  This creates an optimized production build in the `.next` directory.

- **Start Production Server:**
  ```bash
  pnpm start
  ```
  This starts the Next.js production server (requires `pnpm build` first).

## How It Works (End-to-End)

1.  **Frontend Display:**

    - When a user visits the main page (`/`), the `ExploitsTable` component mounts.
    - It uses the tRPC hook (`api.exploits.getSolanaExploits.useQuery`) to fetch data from the backend API.
    - The data (list of exploits from the `Exploit` table) is displayed. Sorting and filtering happen client-side.
    - Statistics are fetched similarly using `api.exploits.getExploitStats.useQuery`.
    - The page layout includes a header, the main content area, and a shared footer.

2.  **User Submission:**

    - A user navigates to `/submit`.
    - They fill out the form. Client-side validation (Zod) provides immediate feedback.
    - On submission, the frontend calls the `api.submissions.submitExploit.useMutation` tRPC hook.
    - The backend (`submissionRouter`) receives the data.
    - It performs server-side validation using its Zod schema.
    - If valid, it saves the data as a new record in the `SubmittedExploit` table in the database with `status: PENDING`.
    - A success/error response is sent back to the frontend, triggering a notification (Sonner toast).
    - **Note:** There is currently no built-in admin interface to review these pending submissions and promote them to the main `Exploit` table. This requires a manual database check or a separate admin tool.

3.  **Backend API (tRPC):**

    - tRPC provides type-safe communication. Routers (`exploitsRouter`, `submissionRouter`) define procedures (like functions).
    - Procedures interact with the database using the Prisma Client (`db`).
    - Input validation is handled using Zod schemas.
    - Errors are managed and thrown using `TRPCError` for proper handling on the client.

4.  **Database (Prisma/PostgreSQL):**

    - The `Exploit` table stores the primary, curated list of exploits shown on the dashboard.
    - The `SubmittedExploit` table acts as a staging area for community contributions, awaiting review.
    - Prisma manages database connections and provides type-safe query building.

5.  **Automated Data Polling:**
    - The `ExploitPollingService` class encapsulates the logic for checking external sources.
    - It needs to be explicitly started (currently via the `startPolling` API endpoint, which might need adjustment for production deployments).
    - Once started, it runs on a timer (`setInterval`).
    - On each interval, it calls `pollExploits`:
      - Determines the active data provider (Flipside or Helius) based on the environment variable.
      - Calls `fetchLatestExploits` on that provider.
        - `FlipsideProvider` runs a SQL query via the Flipside SDK.
        - `HeliusProvider` calls the Helius `/security-events` API endpoint.
      - The provider returns data mapped to a common `Partial<Exploit>` structure.
      - The service iterates through the fetched exploits.
      - For each one, it checks the `Exploit` table in the database using `protocol` and `hackDate`.
      - If it's a new exploit, a record is created in the `Exploit` table.
      - If it exists, certain fields (like amount, recovered status) might be updated if the fetched data differs.
    - Logging is performed throughout this process.

## Contribution

This project aims to be an open-source public good. Community contributions are welcome, especially regarding new or missing exploit data.

- **Data Submission:** Use the "Submit Exploit" form on the dashboard.
- **Code Contribution:** (Further guidelines TBD). Feel free to open issues or pull requests on the GitHub repository.

Note: The process for reviewing and integrating submitted exploit data needs further refinement.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Relevant Links

- [Solana Cookbook](https://github.com/solana-developers/solana-cookbook)
- [Anchor Sealevel Attacks](https://www.anchor-lang.com/docs/references/security-exploits)

## Acknowledgments

- Superteam Security for the original security handbook
- The Solana security research community
- All security researchers who share their findings publicly
