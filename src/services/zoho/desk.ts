import { supabase } from '@/lib/supabase/client';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { zoho } from './_client';
import { ZohoDeskOAuthType } from '@/types/zohodesk-oauth';
import { log } from '@/utils/helpers';

export const ZDeskService = {
  createApiClient: (orgId: string, domain: string): AxiosInstance => {
    const client = axios.create({
      baseURL: `https://desk.zoho.${domain}/api/v1`,
      timeout: 30000,
      headers: { orgId },
    });

    axiosRetry(client, { retries: 2 });

    const getDeskOauth = async () => {
      const dataToken = await supabase.from('zohodesk_oauth').select('*').eq('org_id', orgId).single();
      log('warning', { here: '2', dataToken });

      const oauth = dataToken.data as ZohoDeskOAuthType;
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
            const refreshData = await zoho.oauth.refreshToken(data.refresh_token, data.client_id, data.client_secret);
            const access_token = refreshData.access_token;
            log('warning', { here: '1', refreshData });

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
