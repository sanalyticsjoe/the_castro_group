require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const TODO_DB_ID = '32c760af-5985-81bb-835d-cbe5b8233af8';

exports.handler = async function (event) {
  try {
    const dbInfo = await notion.databases.retrieve({ database_id: TODO_DB_ID });
    const dataSourceId = dbInfo.data_sources[0].id;

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
    });

    const todos = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        task: props.Task?.title?.[0]?.plain_text || 'Untitled',
        status: props.Status?.status?.name || 'Not Started',
        priority: props.Priority?.select?.name || null,
        dueDate: props['Due Date']?.date?.start || null,
      };
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todos),
    };
  } catch (error) {
    console.error('Error fetching todos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to fetch todos' }),
    };
  }
};
