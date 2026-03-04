const keys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

for (const key of keys) {
  const val = process.env[key];
  if (val) {
    // Mask middle portion for security, show first 4 and last 4 chars
    const masked = val.length > 10
      ? val.slice(0, 4) + '****' + val.slice(-4)
      : val;
    console.log(`${key} = ${masked}`);
  } else {
    console.log(`${key} = NOT SET`);
  }
}
