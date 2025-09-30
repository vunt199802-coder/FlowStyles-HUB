export const featureFlags = {
  useRealConversations: true,
  useRealJobs: true,
  useRealServices: true,
  useRealBookings: true,
  useRealProviderSearch: true,
  useRealPortfolio: true,
  useRealMessages: true,
  useRealHairHistory: true,
} as const;

export type FeatureFlags = typeof featureFlags;
