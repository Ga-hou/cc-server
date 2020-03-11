import { registerAs } from '@nestjs/config'

export default registerAs('webrtc', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 3306,
}));