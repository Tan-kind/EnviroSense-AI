import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: 'us', // Change to 'eu' if your Storyblok space is in Europe
  },
});

// Storyblok API configuration for management operations
export const storyblokConfig = {
  contentApiToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  managementApiToken: process.env.STORYBLOK_MANAGEMENT_API_TOKEN,
  spaceId: process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID,
  region: 'us', // Change to 'eu' if your space is in Europe
};

// Helper function to fetch stories with error handling
export async function fetchStoryblokStory(slug: string, options: any = {}) {
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft',
      ...options,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching Storyblok story "${slug}":`, error);
    return null;
  }
}

// Helper function to fetch multiple stories
export async function fetchStoryblokStories(options: any = {}) {
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get('cdn/stories', {
      version: 'draft',
      ...options,
    });
    return data;
  } catch (error) {
    console.error('Error fetching Storyblok stories:', error);
    return { stories: [] };
  }
}
