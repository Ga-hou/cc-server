export default () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  },
  email: {
    pass: ''
  },
  authPass: 'adewcjjzfyexbbeg'
});