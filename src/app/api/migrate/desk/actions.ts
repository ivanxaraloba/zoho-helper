import { configDeskMigration, configMappingOwners } from '@/configs/setup-migation-desk';
import { api } from '@/services/zoho/_client';
import { IDeskUpload, IDeskThread } from '@/types/zoho-responses';
import { formatDatetime, log } from '@/utils/helpers';
import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';

export const getTargetContactId = async (originContactEmail: string): Promise<string | undefined> => {
  console.log('Running - getTargetContactId()');
  console.log(originContactEmail);

  try {
    // Attempt to fetch the target contact
    const targetResponse = await api.target.get(`/contacts/search?email=${originContactEmail}`);
    const targetContact = targetResponse?.data?.data?.[0] as ContactType;
    console.log({ targetContact: targetContact?.id });

    if (targetContact) return targetContact.id;

    console.log('Target contact not found');

    // If target contact doesn't exist, fetch the origin contact
    const originResponse = await api.origin.get(`/contacts/search?email=${originContactEmail}`);
    const originContact = originResponse?.data?.data?.[0] as ContactType;

    if (!originContact) {
      console.log(`-----------> Origin contact not found ${originContactEmail}`);
      return undefined;
    }

    // Remove unnecessary keys from the origin contact
    const keysToRemove: Array<keyof ContactType> = [
      'owner',
      'isEndUser',
      'accountCount',
      'isAnonymous',
      'account',
      'layoutId',
      'webUrl',
      'isSpam',
      'createdTime',
      'modifiedTime',
      'customFields',
      'ownerId',
      'accountId',
    ];
    keysToRemove.forEach((key) => delete originContact[key]);

    console.log({ originContact });

    // Create a new target contact with the sanitized origin contact
    const createResponse = await api.target.post('/contacts', originContact);

    return createResponse?.data?.id;
  } catch (err) {
    const error = (err as any)?.response?.data ?? 'Unknown error data';
    await log('error', { getTargetContactId: error });
    return undefined;
  }
};

export const getOriginTickets = async ({
  fromIndex,
  limit,
  viewId,
}: {
  fromIndex: number;
  limit: number;
  viewId?: string;
}): Promise<TicketType[]> => {
  console.log('running - getOriginTickets()');

  try {
    let tickets: any = [];
    let from = fromIndex;
    let moreTickets = true;

    while (moreTickets) {
      const response = await api.origin.get('/tickets', {
        params: {
          viewId,
          from,
          limit,
          departmentIds: configDeskMigration.origin.departmentId,
        },
      });

      const fetchedTickets = response.data.data;

      tickets = [...tickets, ...fetchedTickets];

      moreTickets = fetchedTickets.length === 100;
      from += limit;
    }
    return tickets;
  } catch (err) {
    const error = (err as any)?.response?.data ?? 'Unknown error data';
    await log('error', { getTickets: error });
    throw err;
  }
};

export const createTargetTicket = async (ticket: TicketType): Promise<TicketType> => {
  console.log('running - createTargetTicket()');

  try {
    const ticketResponse = await api.origin.get(`/tickets/${ticket.id}`);
    const ticketDetails = ticketResponse.data;

    const keysToRemove: Array<keyof TicketType> = [
      'id',
      'layoutId',
      'layoutDetails',
      'sentiment',
      'onholdTime',
      'isOverDue',
      'isResponseOverdue',
      'isSpam',
      'isArchived',
      'modifiedBy',
      'followerCount',
      'slaId',
      'createdBy',
      'modifiedBy',
      'responseDueDate',
      'tagCount',
      'isEscalated',
      'source',
    ];
    keysToRemove.forEach((key) => delete ticketDetails[key]);

    // skip owners with no config
    // if (!configMappingOwners[ticket.assigneeId]) {
    //   log("warning", {
    //     skipped: true,
    //     assigneeId: ticket.assigneeId,
    //     id: ticket.id,
    //     ticket,
    //   });
    //   return ticket;
    // }

    const formattedTicket = {
      ...ticketDetails,
      status: ticketDetails.statusType,
      departmentId: configDeskMigration.target.departmentId,
      assigneeId: configMappingOwners[ticket.assigneeId],
      contactId: await getTargetContactId(ticket.email),
      cf: {
        ...ticketDetails.cf,
        cf_imported_created_time: formatDatetime(ticketDetails.createdTime),
        cf_imported_num_ticket: ticketDetails.ticketNumber,
      },
    } as TicketType;

    const createdTicketResponse = await api.target.post('/tickets', formattedTicket);

    const createdTicket = createdTicketResponse.data;

    const conversationsResponse = await api.origin.get(`/tickets/${ticket.id}/conversations`);

    const conversations = conversationsResponse.data.data;
    for (const conversation of conversations) {
      switch (conversation.type) {
        case 'comment':
          console.log('comment ----------------------------------------------------------');

          await api.target.post(`/tickets/${createdTicket.id}/comments`, {
            contentType: 'html',
            content: conversation.content,
            attachmentIds: conversation.attachments?.map((a: any) => a.id),
          });
          break;
        case 'thread': {
          console.log('threads ----------------------------------------------------------');
          if (formattedTicket.description?.startsWith(conversation.summary.slice(0, -5))) break;

          const responseThread = await api.origin.get(`/tickets/${ticket.id}/threads/${conversation.id}`);
          const thread = responseThread.data as IDeskThread;

          const attachmentIds: string[] = await Promise.all(
            (thread.attachments || []).map(async (attachment) => {
              try {
                const responseFile = await api.origin.get(attachment.href, {
                  responseType: 'arraybuffer',
                });

                const blob = new Blob([responseFile.data], {
                  type: responseFile.headers['content-type'] || 'application/octet-stream',
                });

                const formData = new FormData();
                formData.append('file', blob, attachment.name);

                const uploadResponse = await api.target.post('/uploads', formData);

                const uploaded = uploadResponse.data as IDeskUpload;

                return uploaded.id;
              } catch (err) {
                throw err;
              }
            }),
          ).then((ids) => ids.filter(Boolean) as string[]);

          await api.target.post(`/tickets/${createdTicket.id}/draftReply`, {
            channel: 'EMAIL',
            attachmentIds,
            content: thread.content,
            to: 'ivanxarathreads@loba.com',
            fromEmailAddress: 'apoiocliente@hyundaiportugal.zohodesk.com',
            contentType: 'html',
          });

          break;
        }
        default:
          throw `--- skipping conversation type: ${conversation.type}`;
      }
    }

    const attachmentsResponse = await api.origin.get(`/tickets/${ticket.id}/attachments`);

    const attachments = attachmentsResponse.data.data;
    for (const attachment of attachments) {
      const attachmentResponse = await api.origin.get(
        `/tickets/${ticket.id}/attachments/${attachment.id}/content?orgId=680853844`,
        {
          responseType: 'arraybuffer',
        },
      );

      const buffer = Buffer.from(attachmentResponse.data);
      const fileType = await fileTypeFromBuffer(buffer);
      const mimeType = fileType?.mime || 'application/octet-stream';

      const fileBlob = new Blob([buffer], { type: mimeType });
      const file = new File([fileBlob], attachment.name, { type: mimeType });

      const formData = new FormData();
      formData.append('file', file);

      await api.target.post(`/tickets/${createdTicket.id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    await log('success', { createTicket: formattedTicket });
    return createdTicket;
  } catch (err) {
    const error = (err as any)?.response?.data ?? 'Unknown error data';
    await log('error', { createTicket: ticket, error });
    throw err;
  }
};

export const countTicketsByOwner = async (tickets: TicketType[]) => {
  const users: Record<string, { numTickets: number; user: string }> = {};

  for (const ticket of tickets) {
    if (users[ticket.assigneeId]) {
      users[ticket.assigneeId].numTickets += 1;
    } else {
      users[ticket.assigneeId] = { numTickets: 1, user: '' };
    }
  }

  log('info', users);
};
