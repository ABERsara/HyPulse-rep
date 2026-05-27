const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'MEDIA_SERVER_INTERNAL_URL',
  'FIREBASE_PROJECT_ID',
];

export function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables!');
    missing.forEach((key) => console.error(`   - ${key}`));
    process.exit(1);
  }
  console.log('✅ All environment variables are set successfully.');
}
