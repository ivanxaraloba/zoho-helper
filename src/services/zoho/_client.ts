import { ZDeskService } from './desk';
import { ZOAuthService } from './oauth';
import { configDeskMigration } from '@/configs/setup-migation-desk';

export const zoho = {
  oauth: ZOAuthService,
};

export const apiDeskMigration = {
  origin: ZDeskService.createApiClient(configDeskMigration.origin.orgId, configDeskMigration.origin.domain),
  target: ZDeskService.createApiClient(configDeskMigration.target.orgId, configDeskMigration.target.domain),
};
