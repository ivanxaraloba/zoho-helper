// https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.c18151f8b919dd486f60b23adb70d056.c4ca51f3a3441de166763b58041c4e48&client_id=1000.NLJ0AN0Q4U0TPOSPDTOMS3ZQUEHLGH&client_secret=e95782588313be13dd5ee2acbd72ccb7745e98816e&grant_type=refresh_token
// Desk.tickets.ALL Desk.tasks.ALL Desk.settings.ALL Desk.events.ALL Desk.search.READ Desk.contacts.ALL
// documentation: https://chatgpt.com/share/6760513c-23d0-8013-919a-5ab61423d1bf

import { NextRequest, NextResponse } from 'next/server';
import { chunk, log, sleep } from '@/utils/helpers';
import { createTargetTicket, countTicketsByOwner, getOriginTickets } from './actions';
import { apiDeskMigration } from '@/services/zoho/_client';

interface BodyProps {
  ticketId?: 'string';
}

export async function POST(req: NextRequest) {
  try {
    console.time('run_time');

    log("warning", { status: "1" });

    const body: BodyProps | null = await req.json().catch(() => null);
    const tickets: TicketType[] = body?.ticketId
      ? [await apiDeskMigration.origin.get(`/tickets/${body.ticketId}`).then((res) => res.data)]
      : await getOriginTickets({
        fromIndex: 0,
        limit: 100,
      });

    log("warning", { status: "2" });

    const chunks = chunk(tickets, 8);
    let createdAll = [];

    for (const chunk of chunks) {
      const createdTicketsPromises = chunk.map(async (ticket: TicketType) => {
        try {
          // veirfy if exists
          console.log(`- creating ticket: ${ticket.ticketNumber}`);
          const responseExistsTicket = await apiDeskMigration.target.get(
            `/tickets/search?customField1=cf_imported_num_ticket:${ticket.ticketNumber}`,
          );
          const existsTicket = responseExistsTicket?.data?.data?.[0];
          if (existsTicket) {
            console.log(`--- already exists: ${ticket.ticketNumber} - ${ticket.id}`);
            log('warning', {
              alreadyExists: true,
              originTicketId: ticket.id,
              targetTicketId: existsTicket?.id,
            });
            return;
          }
          // create ticket
          const created = await createTargetTicket(ticket);
          sleep(200);
          return created;
        } catch (err: any) {
          console.error(err?.response.data);
        }
      });

      const createdTickets = await Promise.all(createdTicketsPromises);
      createdAll.push(...createdTickets);
    }

    createdAll = createdAll.filter(Boolean);

    console.timeEnd('run_time');

    return NextResponse.json(
      {
        error: null,
        message: 'success',
        data: {
          totalRecords: createdAll?.length,
        },
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        error: errorMessage,
        data: null,
      },
      {
        status: 500,
      },
    );
  }
}
