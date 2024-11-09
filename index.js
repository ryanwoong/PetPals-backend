import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import 'dotenv/config'
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getItems (db) {
    const itemsCol = collection(db, 'items');
    const itemsSnapshot = await getDocs(itemsCol)
    const itemsList = itemsSnapshot.docs.map(doc => doc.data());

    return itemsList;

}

let data = await getItems(db);
console.log(data);