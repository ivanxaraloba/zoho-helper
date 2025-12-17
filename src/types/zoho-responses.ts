export interface IDeskThread {
  attachments: Array<{
    id: string;
    name: string;
    size: string; // numeric-as-string
    status: 'VALID' | string;
    href: string;
    previewurl: string;
  }>;

  content: string; // HTML content
  id: string;
  channel: string;
  canReply: boolean;
  contentType: 'text/html' | 'text/plain' | string;
  hasAttach: boolean;
  status: 'SUCCESS' | string;
  summary: string;

  author: {
    id: string;
    name: string;
    email: string;
    photoURL: string | null;
    type: 'END_USER' | 'AGENT' | string;
    firstName: string | null;
    lastName: string | null;
  };

  attachmentCount: string; // numeric-as-string
  sentiment: string | null;
  aspects: unknown | null;
  channelRelatedInfo: unknown | null;
  readReceipts: unknown | null;
  impersonatedUser: unknown | null;

  source: {
    extId: string | null;
    appName: string | null;
    appPhotoURL: string | null;
    permalink: string | null;
    type: 'SYSTEM' | string;
  };

  isDescriptionThread: boolean;
  isContentTruncated: boolean;
  keyWords: string[];
  fullContentURL: string | null;
  actions: unknown[];
  visibility: 'public' | 'private' | string;
  createdTime: string; // ISO datetime
  direction: 'in' | 'out' | string;
}

export interface IDeskUpload {
  id: string;
  creatorId: string;
  name: string;
  size: string;
  createdTime: string;
  previewurl: string | null;
  href: string;
}
