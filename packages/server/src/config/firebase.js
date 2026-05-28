import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(join(__dirname, '../../firebase-service-account.json'), 'utf8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;