import axios from "axios";

const ZOAUTH_API_BASE_URL = "https://accounts.zoho.com/oauth/v2";

export const ZOAuthService = {
  refreshToken: async (
    refresh_token: string,
    client_id: string,
    client_secret: string,
  ) => {
    try {
      const responseToken = await axios.post(
        `${ZOAUTH_API_BASE_URL}/token?refresh_token=${refresh_token}&client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token`,
      );
      const data = await responseToken.data;

      if (data?.error) throw Error("Error refreshing access token");
      return data;
    } catch (error) {
      throw Error("Error refreshing access token");
    }
  },
};
