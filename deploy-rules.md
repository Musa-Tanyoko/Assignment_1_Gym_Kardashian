# Deploy Firestore Security Rules

## Quick Fix for Credits Issue

The credits are not updating because of Firebase Security Rules blocking write operations. Follow these steps to fix it:

### Option 1: Deploy Rules via Firebase CLI

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done):
   ```bash
   firebase init firestore
   ```

4. **Deploy the security rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Deploy via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules`
5. Click **Publish**

### Option 3: Temporary Test Rules (Development Only)

If you need to test quickly, you can temporarily use these permissive rules (**NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Verify the Fix

After deploying the rules:

1. **Clear browser cache** and reload the app
2. **Complete a workout** and check the console logs
3. **Verify credits increase** in the UI
4. **Check Firestore** to confirm data is being written

## Expected Console Output After Fix

You should see:
- ✅ "User profile updated successfully"
- ✅ "Activity log saved successfully" 
- ✅ "Socialite data updated successfully"
- ✅ "Workout completed successfully, new credits: 302"

## Troubleshooting

If issues persist:

1. **Check Authentication**: Ensure user is properly logged in
2. **Verify User ID**: Check that `request.auth.uid` matches the document path
3. **Test Rules**: Use Firebase Console's Rules Playground to test your rules
4. **Check Logs**: Look for any remaining permission errors in console

## Security Note

The rules provided allow users to:
- Read/write their own user data
- Read/write their own socialite data  
- Read/write their own activity logs
- Read/write their own workout data

This maintains security while allowing the app to function properly. 