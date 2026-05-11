import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Check if Sanity is properly configured
const isConfigured = projectId && projectId !== 'placeholder'

export const client = isConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : // Return a mock client that returns empty data when Sanity isn't configured
    {
      fetch: async () => [],
    } as unknown as ReturnType<typeof createClient>
