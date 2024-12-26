import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Get the directory path using import.meta.url and handle it correctly
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Resolve the full path to the service account JSON file
let serviceAccountPath = path.join(__dirname, '../config/serviceAccountKey.json');

// Check if the path starts with a backslash and remove it
if (serviceAccountPath.startsWith('\\')) {
  serviceAccountPath = serviceAccountPath.slice(1);
}


// Check if the file exists
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase Admin initialized successfully.");
} else {
  console.error("Service account file not found at:", serviceAccountPath);
}

export default admin;
