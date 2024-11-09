import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import 'dotenv/config'
import express from "express";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration

const app = express();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  
};

const appDB = initializeApp(firebaseConfig);
const db = getFirestore(appDB);

// get info from Items collection
async function getItems (db) {
    const itemsCol = collection(db, 'items');
    const itemsSnapshot = await getDocs(itemsCol)
    const itemsList = itemsSnapshot.docs.map(doc => doc.data());

    return itemsList;
}

// get info from users collection
async function getUsers (db) {
    const usersCol = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCol)
    const usersList = usersSnapshot.docs.map(doc => doc.data());

    return usersList;
}

// get info from users/pets collection
async function getUserPets (db) {
    const userCollection = collection(db, 'users');
    const userSnapshot = await getDocs(userCollection);

    const object = new Object();


    const userPetsList = await Promise.all(
        userSnapshot.docs.map(async (userDoc) => {
            const petsCollection = collection(userDoc.ref, 'pets'); 
            const petsSnapshot = await getDocs(petsCollection);
            const petsList = petsSnapshot.docs.map(petDoc => petDoc.data());
            
            object.userDoc = userDoc.id
            object.pets = petsList
        })
    );
    return object;
}

// get info from users/posts collection
async function getUserPosts (db) {
    const userCollection = collection(db, 'users');
    const userSnapshot = await getDocs(userCollection);

    const object = new Object();


    const userPetsList = await Promise.all(
        userSnapshot.docs.map(async (userDoc) => {
            const postsCollection = collection(userDoc.ref, 'posts');
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map(postDoc => postDoc.data());
            
            object.userDoc = userDoc.id
            object.posts = postsList
        })
    );
    return object;
}

//get info from user/pets/items collection
async function getUserPetItems (db) {
    const userCollection = collection(db, 'users');
    const userSnapshot = await getDocs(userCollection);

    const object = new Object();

    const userPetItemsList = await Promise.all(
        userSnapshot.docs.map(async (userDoc) => {
            const petsCollection = collection(userDoc.ref, 'pets');
            const petsSnapshot = await getDocs(petsCollection);
    
            const petsList = await Promise.all(
                petsSnapshot.docs.map(async (petDoc) => {
                    const petItemsCollection = collection(petDoc.ref, 'items');
                    const petItemsSnapshot = await getDocs(petItemsCollection);
                    
                    const petItemsList = petItemsSnapshot.docs.map(petItems => petItems.data());
    
                    object.userId = userDoc.id
                    object.petId = petDoc.id
                    object.petItems = petItemsList
                    
                })
            );
        }),
    );
    return object;
}

// let data_1 = await getItems(db);
// let data_2 = await getUsers(db);
// let data_3 =  await getUserPets(db);
// let data_4 =  await getUserPetItems(db);
// let data_5 = await getUserPosts(db);
// let data_6 = await getItems(db);
// console.log(data_1);
// console.log(data_2);
// console.log(data_3);
// console.log(data_4);
// console.log(data_5);
// console.log(data_6);


app.listen(5100, () => {
    console.log("Listening");
});