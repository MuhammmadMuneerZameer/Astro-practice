/**
 * One-time setup script: Grant the admin custom claim to your admin Firebase user.
 *
 * Run once from your local machine (not the public server):
 *   node scripts/set-admin-claim.js
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

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });

// Replace with the UID of your admin Firebase user.
// Find it in Firebase Console → Authentication → Users
const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_USER_UID';

async function grantAdminClaim() {
  await getAuth().setCustomUserClaims(ADMIN_UID, { admin: true });
  console.log(`✅ Admin claim set for user ${ADMIN_UID}`);
  console.log('The user must sign out and sign back in for the claim to take effect.');
}

grantAdminClaim().catch(console.error);
