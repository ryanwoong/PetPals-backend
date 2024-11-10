import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import 'dotenv/config'
import express from 'express';
import { searchPrompt } from './util/searchPrompt.js';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration

const app = express();
const PORT = 3243;

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  
};

const appDb = initializeApp(firebaseConfig);
const db = getFirestore(appDb);

async function getItems (db) {
    const itemsCol = collection(db, 'items');
    const itemsSnapshot = await getDocs(itemsCol)
    const itemsList = itemsSnapshot.docs.map(doc => doc.data());

    return itemsList;

}

let data = await getItems(db);
console.log(data);

app.post("/searchPrompt", (req,res) => {
    const text = req.body.text;


})

let text = `Like a garden in early spring - there's still some frost on the ground, but I can feel things starting to grow again. The medication is finally working, I think. Yesterday I caught myself making plans for next month, which I haven't done in... I can't even remember how long.`

let llm = await searchPrompt(text);

console.log(llm)


app.listen(PORT, () => {
    console.log("listening on port " + PORT)
})
