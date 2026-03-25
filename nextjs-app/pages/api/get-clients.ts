
import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not set in environment variables.");
    }

    // STEP 1: Retrieve the database to get its underlying Data Source ID
    const dbInfo = await notion.databases.retrieve({ 
      database_id: databaseId 
    });
    
    // Grab the first data source ID from the array
    const dataSourceId = dbInfo.data_sources[0].id;

    // STEP 2: Use the new Notion SDK method to query the actual data
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
    });

    const clients = response.results.map(page => {
      const { properties } = page;
      let photoUrl = null;

      // This assumes your "Files & media" property in Notion is named "Photo"
      const photoProperty = properties.Photo;
      if (photoProperty && photoProperty.files && photoProperty.files.length > 0) {
        const fileInfo = photoProperty.files[0];
        if (fileInfo.type === 'external') {
          photoUrl = fileInfo.external.url;
        } else if (fileInfo.type === 'file') {
          // Note: Notion-hosted file URLs are temporary and expire after one hour.
          photoUrl = fileInfo.file.url;
        }
      }

      return {
        id: page.id,
        name: properties.Name?.title[0]?.plain_text || 'No Name',
        status: properties.Status?.status?.name || 'No Status',
        email: properties.Email?.email || null,
        phone: properties.Phone?.phone_number || null,
        photoUrl: photoUrl
      };
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch data from Notion' });
  }
}
