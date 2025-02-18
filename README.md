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

# Zoho Desk Migration Setup

1. **Complete these steps for each project (origin + target)**

   - ***Create a Self Client***  
   Go to [Zoho API Console](https://api-console.zoho.com/) and create a new Self Client with the following scopes:  
      ```bash
      Desk.tickets.ALL, Desk.tasks.ALL, Desk.settings.ALL, Desk.events.ALL, Desk.search.READ, Desk.contacts.ALL
      ```

   - ***Generate Tokens***  
   Generate a `refresh_token` and `access_token`.

   - ***Store Tokens***  
   Add the project tokens/keys as a new row in your database.

2. **Update Configuration**  
   - Open `setup-migration-desk.ts`.
   - Set the `origin` to the project you're migrating data from.
   - Set the `target` to the project that will receive the data.

3. **Initiate Migration**  
   Send a POST request to the `api/migrate/desk` endpoint to start the migration.

