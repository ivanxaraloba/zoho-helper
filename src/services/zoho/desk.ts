import { supabase } from '@/utils/supabase/client';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { zoho } from './_client';

export const ZDeskService = {
  createApiClient: (orgId: string, domain: string): AxiosInstance => {
    const client = axios.create({
      baseURL: `https://desk.zoho.${domain}/api/v1`,
      timeout: 30000,
      headers: { orgId },
    });

    axiosRetry(client, { retries: 2 });

    const getDeskOauth = async () => {
      const { data } = await supabase.from('zohodesk_oauth').select('*').eq('org_id', orgId).single();
      const oauth = data as ZohoDeskOAuthType;
      return oauth;
    };

    client.interceptors.request.use(
      async (config) => {
        const data = await getDeskOauth();
        config.headers.Authorization = `Zoho-oauthtoken ${data.access_token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log('error - client.interceptors.response');
        console.log(error.response?.data);

        if (error.response?.data?.errorCode === 'INVALID_OAUTH') {
          const data = await getDeskOauth();

          try {
            const { access_token } = await zoho.oauth.refreshToken(
              data.refresh_token,
              data.client_id,
              data.client_secret,
            );

            await supabase.from('zohodesk_oauth').update({ access_token }).eq('org_id', orgId);

            error.config.headers.Authorization = `Zoho-oauthtoken ${access_token}`;
            return client(error.config);
          } catch (refreshError) {
            console.error('Error refreshing the token - desk.ts');
          }
        }

        return Promise.reject(error);
      },
    );

    return client;
  },
};
