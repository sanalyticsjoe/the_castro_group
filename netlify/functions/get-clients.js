// netlify/functions/get-clients.js
require('dotenv').config();
const { Client } = require('@notionhq/client');

const { MY_NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;
const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;

// Initialize the Notion client
const notion = new Client({ auth: MY_NOTION_API_KEY });
const notion = new Client({ auth: NOTION_API_KEY });

exports.handler = async function(event, context) {
  // A check to ensure environment variables are loaded in the function's environment
  if (!MY_NOTION_API_KEY || !NOTION_DATABASE_ID) {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.error('Server Error: Missing NOTION_API_KEY or NOTION_DATABASE_ID');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server configuration error.' }),
    };
  }

  try {
    // STEP 1: Retrieve the database object to find its underlying data source.
    // This is the required flow for this version of the Notion client.
    const dbInfo = await notion.databases.retrieve({
      database_id: NOTION_DATABASE_ID
    });

    // STEP 2: Query the data source using the ID from the database object.
    const response = await notion.dataSources.query({
      data_source_id: dbInfo.data_sources[0].id,
    });

    // Map the results to a cleaner format for your front-end
    const clients = response.results.map(page => {
      return {
        id: page.id,
        name: page.properties.Name?.title[0]?.plain_text || 'Unnamed Client',
        status: page.properties.Status?.status?.name || 'No Status',
        phone: page.properties.Phone?.phone_number || 'No Phone',
        email: page.properties.Email?.email || 'No Email'
      };
    });

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        // Optional: Add CORS headers here if your frontend is on a different domain
        // 'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(clients)
    };

  } catch (error) {
    console.error('Failed to fetch from Notion:', error);
    // Send a generic error message to the client for security
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to fetch clients from Notion.' }) 
    };
  }
};