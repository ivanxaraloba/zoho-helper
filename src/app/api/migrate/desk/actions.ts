import {
  configDeskMigration,
  configMappingOwners,
} from "@/configs/setup-migation-desk";
import { apiDeskMigration } from "@/services/zoho/desk";
import { formatDatetime, log } from "@/utils/helpers";
import { fileTypeFromBuffer } from "file-type";

export const getTargetContactId = async (
  originContactEmail: string,
): Promise<string | undefined> => {
  console.log("Running - getTargetContactId()");

  console.log(originContactEmail);

  try {
    // Attempt to fetch the target contact
    const targetResponse = await apiDeskMigration.target.get(
      `/contacts/search?email=${originContactEmail}`,
    );
    const targetContact = targetResponse?.data?.data?.[0] as ContactType;
    console.log({ targetContact });

    if (targetContact) return targetContact.id;

    console.log("Target contact not found");

    // If target contact doesn't exist, fetch the origin contact
    const originResponse = await apiDeskMigration.origin.get(
      `/contacts/search?email=${originContactEmail}`,
    );
    const originContact = originResponse?.data?.data?.[0] as ContactType;

    if (!originContact) {
      console.log(
        `-----------> Origin contact not found ${originContactEmail}`,
      );
      return undefined;
    }

    // Remove unnecessary keys from the origin contact
    const keysToRemove: Array<keyof ContactType> = [
      "owner",
      "isEndUser",
      "accountCount",
      "isAnonymous",
      "account",
      "layoutId",
      "webUrl",
      "isSpam",
      "createdTime",
      "modifiedTime",
      "customFields",
      "ownerId",
      "accountId",
    ];
    keysToRemove.forEach((key) => delete originContact[key]);

    console.log({ originContact });

    // Create a new target contact with the sanitized origin contact
    const createResponse = await apiDeskMigration.target.post(
      "/contacts",
      originContact,
    );

    return createResponse?.data?.id;
  } catch (err) {
    const error = (err as any)?.response?.data ?? "Unknown error data";
    await log("error", { getTargetContactId: error });
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
  console.log("running - getOriginTickets()");

  try {
    let tickets: any = [];
    let from = fromIndex;
    let moreTickets = true;

    while (moreTickets) {
      const response = await apiDeskMigration.origin.get("/tickets", {
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
    const error = (err as any)?.response?.data ?? "Unknown error data";
    await log("error", { getTickets: error });
    throw err;
  }
};

export const createTargetTicket = async (
  ticket: TicketType,
): Promise<TicketType> => {
  console.log("running - createTargetTicket()");

  try {
    const ticketResponse = await apiDeskMigration.origin.get(
      `/tickets/${ticket.id}`,
    );
    const ticketDetails = ticketResponse.data;

    const keysToRemove: Array<keyof TicketType> = [
      "id",
      "layoutId",
      "layoutDetails",
      "sentiment",
      "onholdTime",
      "isOverDue",
      "isResponseOverdue",
      "isSpam",
      "isArchived",
      "modifiedBy",
      "followerCount",
      "slaId",
      "createdBy",
      "modifiedBy",
      "responseDueDate",
      "tagCount",
      "isEscalated",
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
      departmentId: configDeskMigration.target.departmentId,
      assigneeId: configMappingOwners[ticket.assigneeId],
      contactId: await getTargetContactId(ticket.email),
      cf: {
        ...ticketDetails.cf,
        cf_imported_created_time: formatDatetime(ticketDetails.createdTime),
        cf_imported_num_ticket: ticketDetails.ticketNumber,
      },
    };

    const createdTicketResponse = await apiDeskMigration.target.post(
      "/tickets",
      formattedTicket,
    );

    const createdTicket = createdTicketResponse.data;

    const commentsResponse = await apiDeskMigration.origin.get(
      `/tickets/${ticket.id}/comments`,
    );

    const comments = commentsResponse.data.data || [];
    for (const comment of comments) {
      await apiDeskMigration.target.post(
        `/tickets/${createdTicket.id}/comments`,
        {
          contentType: "html",
          content: comment.content,
          attachmentIds: comment.attachments.map((a: any) => a.id),
        },
      );
    }

    const attachmentsResponse = await apiDeskMigration.origin.get(
      `/tickets/${ticket.id}/attachments`,
    );

    const attachments = attachmentsResponse.data.data;
    for (const attachment of attachments) {
      const attachmentResponse = await apiDeskMigration.origin.get(
        `/tickets/${ticket.id}/attachments/${attachment.id}/content?orgId=680853844`,
        {
          responseType: "arraybuffer",
        },
      );

      const buffer = Buffer.from(attachmentResponse.data);
      const fileType = await fileTypeFromBuffer(buffer);
      const mimeType = fileType?.mime || "application/octet-stream";

      const fileBlob = new Blob([buffer], { type: mimeType });
      const file = new File([fileBlob], attachment.name, { type: mimeType });

      const formData = new FormData();
      formData.append("file", file);

      await apiDeskMigration.target.post(
        `/tickets/${createdTicket.id}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    }

    await log("success", { createTicket: formattedTicket });
    return createdTicket;
  } catch (err) {
    const error = (err as any)?.response?.data ?? "Unknown error data";
    await log("error", { createTicket: ticket, error });
    throw err;
  }
};

export const countTicketsByOwner = async (tickets: TicketType[]) => {
  const users: Record<string, { numTickets: number; user: string }> = {};

  for (const ticket of tickets) {
    if (users[ticket.assigneeId]) {
      users[ticket.assigneeId].numTickets += 1;
    } else {
      users[ticket.assigneeId] = { numTickets: 1, user: "" };
    }
  }

  log("info", users);
};
