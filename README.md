# Getting Started

Follow these steps to run the project locally:

## 1. Install dependencies

```bash
npm install
```

## 2. Start the development server

```bash
npm run dev
```

---

# Supabase Setup

## 1. Open Supabase

* Open your Supabase project dashboard.
* Go to **SQL Editor**.

## 2. Create the OAuth table

Run the following SQL:

```sql
CREATE TABLE zohodesk_oauth (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  org_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE zohodesk_oauth ENABLE ROW LEVEL SECURITY;

-- Index for performance
CREATE INDEX idx_zohodesk_oauth_org_id ON zohodesk_oauth(org_id);
```

## 3. Insert credentials

You will later add **one row per project** (origin and target) after generating Zoho tokens.

---

# Zoho Desk Migration Setup

> These steps must be completed **for each project** (origin **and** target).

## 1. Create a Zoho Self Client

* Go to: [https://api-console.zoho.com/](https://api-console.zoho.com/)
* Create a **Self Client**
* Use the following scopes:

```text
Desk.basic.ALL,
Desk.community.ALL,
Desk.tickets.ALL,
Desk.tasks.ALL,
Desk.settings.ALL,
Desk.events.ALL,
Desk.search.READ,
Desk.contacts.ALL
```

## 2. Generate OAuth Tokens

Generate an **authorization code**, then exchange it for tokens using the exact client details.

### Origin project

```http
POST https://accounts.zoho.com/oauth/v2/token
```

```text
grant_type=authorization_code
client_id=1000.EVOB7G4R5G83GALWUV4L2MAH3XK4UL
client_secret=8f9984bc886a0a723a243f41f6722043d33cc6df5e
redirect_uri=www.google.com
code=1000.bc734b1f2cbbe3ba2e0cd2639bd95bf4.ff437fbd413e621d82c7debbd5638477
```

### Target project

```http
POST https://accounts.zoho.com/oauth/v2/token
```

```text
grant_type=authorization_code
client_id=1000.NLJ0AN0Q4U0TPOSPDTOMS3ZQUEHLGH
client_secret=e95782588313be13dd5ee2acbd72ccb7745e98816e
redirect_uri=www.google.com
code=1000.508637ad147137018f2afeefafafe166.118d55dcdc8d40f74184d5ae75f89a16
```


## 3. Store tokens in Supabase

Insert the generated credentials into the `zohodesk_oauth` table:

- `name` – Project name
- `org_id` – Zoho Desk Org ID
- `access_token`
- `refresh_token`
- `client_id`
- `client_secret`

---

# Migration Configuration

## 1. Update migration config

Open the file:

[`setup-migration-desk.ts`](./setup-migration-desk.ts)

Update the following fields:

- `origin` → project to migrate **from**
- `target` → project to migrate **to**
- Ensure all IDs match the correct Zoho Desk configuration

## 2. Start migration

Send a POST request to:

```http
POST /api/migrate/desk
```

This will start the Zoho Desk data migration from origin to target.
