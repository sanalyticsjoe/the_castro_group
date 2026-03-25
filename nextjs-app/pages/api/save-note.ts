
import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createLeadsDatabase } from '../../lib/notion';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PARENT_PAGE_ID = '320760af-5985-8011-90bf-e987d9663814';
const LEADS_DB_NAME = 'Leads';
const CONTACTS_DB_ID = '32c760af-5985-81d4-99c0-000b16b3a1b9';

async function getOrCreateDatabase(dbName: string, parentId: string) {
  const response = await notion.search({
    query: dbName,
    filter: {
      value: 'database',
      property: 'object',
    },
  });

  if (response.results.length > 0) {
    return response.results[0].id;
  } else {
    if (dbName === LEADS_DB_NAME) {
      const newDb = await createLeadsDatabase(parentId);
      return newDb.id;
    }
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { note } = req.body;

    const leadsDbId = await getOrCreateDatabase(LEADS_DB_NAME, PARENT_PAGE_ID);

    if (note.toLowerCase().startsWith('new lead:')) {
      const leadName = note.substring('new lead:'.length).trim();
      await notion.pages.create({
        parent: {
          database_id: leadsDbId,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: leadName,
                },
              },
            ],
          },
        },
      });
    } else if (note.toLowerCase().startsWith('new contact:')) {
      const contactName = note.substring('new contact:'.length).trim();
      await notion.pages.create({
        parent: {
          database_id: CONTACTS_DB_ID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: contactName,
                },
              },
            ],
          },
        },
      });
    }

    res.status(200).json({ message: 'Note saved successfully' });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Failed to save note' });
  }
}
