
// generate token origin 
// [POST] https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=1000.EVOB7G4R5G83GALWUV4L2MAH3XK4UL&client_secret=8f9984bc886a0a723a243f41f6722043d33cc6df5e&redirect_uri=www.google.com&code=1000.bc734b1f2cbbe3ba2e0cd2639bd95bf4.ff437fbd413e621d82c7debbd5638477


// generate token target 
// [POST] https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=1000.NLJ0AN0Q4U0TPOSPDTOMS3ZQUEHLGH&client_secret=e95782588313be13dd5ee2acbd72ccb7745e98816e&redirect_uri=www.google.com&code=1000.508637ad147137018f2afeefafafe166.118d55dcdc8d40f74184d5ae75f89a16

// table
/*
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

-- Create an index on org_id for performance
CREATE INDEX idx_zohodesk_oauth_org_id ON zohodesk_oauth(org_id);
*/



export type ZohoDeskOAuthType = {
  id: number;
  name: string;
  org_id: string;
  access_token: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
  created_at: string;
};
