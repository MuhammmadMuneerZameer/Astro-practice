/**
 * One-time setup script: Grant the admin custom claim to a Firebase user.
 *
 * Usage:
 *   node scripts/set-admin-claim.js <firebase-uid>
 *
 * Find the UID in Firebase Console → Authentication → Users
 *
 * Prerequisites:
 *   npm install firebase-admin
 *   Download your Firebase service account key from:
 *   Firebase Console → Project Settings → Service Accounts → Generate New Private Key
 *   Save it as scripts/serviceAccountKey.json (NEVER commit this file)
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'module';

const ADMIN_UID = process.argv[2];
if (!ADMIN_UID) {
  console.error('Usage: node scripts/set-admin-claim.js <firebase-uid>');
  console.error('Find the UID in Firebase Console → Authentication → Users');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });

async function grantAdminClaim() {
  await getAuth().setCustomUserClaims(ADMIN_UID, { admin: true });
  console.log(`✅ Admin claim set for user ${ADMIN_UID}`);
  console.log('The user must sign out and sign back in for the claim to take effect.');
}

grantAdminClaim().catch(console.error);
