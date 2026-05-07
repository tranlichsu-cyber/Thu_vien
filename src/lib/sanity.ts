import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-05-07';

export const sanityClient = projectId ? createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` if you want to ensure fresh data
}) : null;

export const fetchStories = async () => {
  if (!sanityClient) return null;
  const query = `*[_type == "story"] {
    "id": _id,
    title,
    category,
    icon,
    "image": image.asset->url,
    type,
    link,
    color
  }`;
  return await sanityClient.fetch(query);
};

export const fetchMaterials = async () => {
  if (!sanityClient) return null;
  const query = `*[_type == "material"] {
    "id": _id,
    title,
    type,
    grade,
    link,
    date
  }`;
  return await sanityClient.fetch(query);
};
