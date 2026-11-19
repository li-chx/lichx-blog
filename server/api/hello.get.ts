export default defineEventHandler(() => {
  return {
    message: 'Hello from Nuxt server',
    time: new Date().toISOString(),
  };
});
