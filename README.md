# Getting Started

Follow these steps to run the project locally:

1. Install the required dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

<br />


# Setup Desk Migration

1. Open the file `setup-migration-desk.ts`.

2. Update the configuration object:
   - Set the `origin` property to the project where tickets/contacts are being fetched from.
   - Set the `target` property to the project that will receive the imported data.
   
3. Send a POST request to the `api/migrate/desk` endpoint to initiate the migration.
