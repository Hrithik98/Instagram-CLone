import firebase from "firebase";
  const firebaseApp = firebase.initializeApp(
    {
        apiKey: {Your Api key},
        authDomain: {Your authDomain},
        projectId: {Your projectId},
        storageBucket: {Your storageBucket},
        messagingSenderId: {Your messagingSenderId},
        appId: {Your appId},
        measurementId: {Your measurementId}
      }
  );
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage };