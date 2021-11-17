# API

This folder is dedicated to Firebase-related files. For example,

- `firestore` contains rules for the Firestore database
- `functions` contains code for the Cloud functions
- `storage` contains rules for Storage

## Getting Started

- Run `npm install` to download the needed dependencies

## Firestore

### Testing

1. Run the Firestore emulator by running the folowing command: `npm run serve:firestore`
2. Uncomment out match functions in `firestore.rules` specifically designed for testing
3. Test the Firestore rules against the emulator: `npm run test:firestoreRules`
4. Comment out match functions again

### Deployment

1. Make sure you are logged in with `firebase login`
2. Deploy using the following: `npm run deploy:firestoreRules`

## Functions

### Testing

1. Run the Functions emulator by running the folowing command: `npm run serve:functions`
2. Test the Firestore rules against the emulator: `npm run test:functions`

### Deployment

1. Make sure you are logged in with `firebase login`
2. Deploy using the following: `npm run deploy:functions`

## Storage

### Deployment

1. Make sure you are logged in with `firebase login`
2. Deploy using the following: `npm run deploy:storageRules`
