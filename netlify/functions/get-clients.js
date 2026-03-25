const { Client } = require("@notionhq/client");
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

exports.handler = async function(event, context) {
  try {
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not set in environment variables.");
    }

    const dbInfo = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId = dbInfo.data_sources[0].id;

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clients),
    };
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to fetch data from Notion' }),
    };
  }
};