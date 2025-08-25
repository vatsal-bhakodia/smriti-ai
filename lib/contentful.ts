// Contentful client utility for fetching blog data
import { createClient } from 'contentful';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

// Create a mock client for development if credentials are missing
let contentfulClient: any;

if (!space || !accessToken) {
  console.warn('Contentful credentials not found. Using mock client for development.');
  // Mock client for development
  contentfulClient = {
    getEntries: () => Promise.resolve({ items: [] }),
    getEntry: () => Promise.resolve(null),
  };
} else {
  contentfulClient = createClient({
    space,
    accessToken,
  });
}

export { contentfulClient };
