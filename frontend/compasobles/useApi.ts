// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig();

  const fetchApi = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    fetchApi,
  };
};
