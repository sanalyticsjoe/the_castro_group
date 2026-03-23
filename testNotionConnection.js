require('dotenv').config();
const { Client } = require('@notionhq/client');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error("Error: Make sure you have a .env file with NOTION_API_KEY and NOTION_DATABASE_ID");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

async function testNotionConnection() {
  console.log("Attempting to connect to Notion API...");
  console.log(`Using API Key (first 5 chars): ${NOTION_API_KEY.substring(0, 5)}...`);
  console.log(`Using Database ID: ${NOTION_DATABASE_ID}`);

  try {
    // STEP 1: Retrieve the database object to find its underlying data source.
    // This is the required flow for this version of the Notion client.
    const dbInfo = await notion.databases.retrieve({
      database_id: NOTION_DATABASE_ID
    });
    console.log(`\nFound Data Source ID: ${dbInfo.data_sources[0].id}`);

    // STEP 2: Query the data source to confirm the connection is working.
    const response = await notion.dataSources.query({
      data_source_id: dbInfo.data_sources[0].id,
      page_size: 1 // We only need one result to confirm connection
    });

    if (response && response.results) {
      console.log("\nSUCCESS: Successfully connected to Notion data source!");
      console.log(`Found ${response.results.length} page(s) (requested 1).`);
      if (response.results.length > 0) {
        console.log("Example page title:", response.results[0].properties.Name?.title[0]?.plain_text || "No Title Property");
      }
    } else {
      console.error("\nERROR: Notion API returned an unexpected response structure.");
      console.error(JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error("\nERROR: Failed to connect to Notion API.");
    console.error("Full error object:", JSON.stringify(error, null, 2));
  }
}

testNotionConnection();