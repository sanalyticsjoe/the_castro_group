const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function createLeadsDatabase(parentId) {
  try {
    const response = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentId,
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Leads',
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Source: {
          rich_text: {},
        },
        Status: {
          select: {
            options: [
              {
                name: 'New',
              },
              {
                name: 'Contacted',
              },
              {
                name: 'Qualified',
              },
              {
                name: 'Unqualified',
              },
            ],
          },
        },
      },
    });
    console.log('Successfully created Leads database:', response);
    return response;
  } catch (error) {
    console.error('Error creating Leads database:', error);
    throw error;
  }
}

module.exports = {
  createLeadsDatabase,
};
