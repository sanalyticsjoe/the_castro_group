// netlify/functions/get-clients.js

exports.handler = async function(event, context) {
  try {
    const API_KEY = process.env.NOTION_API_KEY;
    const DB_ID = process.env.NOTION_DATABASE_ID; 

    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { statusCode: response.status, body: `Notion Error: ${errorData}` };
    }

    const data = await response.json();

    const clients = data.results.map(page => {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clients)
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

exports.handler = async function(event, context) {
  // Ensure you have the required environment variables
  console.log("Checking environment variables...");
  console.log("NOTION_API_KEY:", NOTION_API_KEY);
  console.log("NOTION_CLIENTS_DB_ID:", NOTION_CLIENTS_DB_ID);

  if (!NOTION_API_KEY || !NOTION_CLIENTS_DB_ID) {
    return {
      statusCode: 500,
