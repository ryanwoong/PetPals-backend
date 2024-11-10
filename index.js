import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import 'dotenv/config'
import express from "express";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { userConverter, User } from './classes/User.js';
import { Pet, petConverter } from './classes/Pet.js';
import { Post, postConverter } from './classes/Post.js';
import { Item, itemConverter } from './classes/Item.js';

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
const auth = getAuth(appDB);

// ########################################################################################

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

// ########################################################################################

// Authentication function examples
async function registerUser(auth, db, email, password, username, level, coins = 0, xp = 0, petsData = [], postsData = []) {
    try {
        // Step 1: Register the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        console.log("User registered:", uid);

        // Step 2: Initialize a User instance and save to Firestore with the converter
        const newUser = new User(username, coins, email, level, uid, xp);
        const userRef = doc(db, 'users', uid).withConverter(userConverter)
        await setDoc(userRef, newUser);

        // Step 3: Initialize each Pet and save to the 'pets' collection under the user
        const petsCollectionRef = collection(userRef, 'pets').withConverter(petConverter);
        const postsCollectionRef = collection(userRef, 'posts').withConverter(postConverter);

        await Promise.all(
            petsData.map(async (petData) => {
                const pet = new Pet(petData.id, petData.level, petData.name, petData.type, petData.xp);
                const petRef = await addDoc(petsCollectionRef, pet);

                // Initialize each Item in the 'items' sub-collection within the pet document
                const itemsCollectionRef = collection( petRef, 'items').withConverter(itemConverter);
                await Promise.all(
                    itemData.map(async (itemData) => {
                        const item = new Item(itemData.id, itemData.name, itemData.cost, itemData.description);
                        await addDoc(itemsCollectionRef, item);
                    })
                );
            }),

            postsData.map(async (postData) => {
                const post = new Post(postData.id, postData.author, postData.body, postData.dateCreated, postData.tags);
                await addDoc(postsCollectionRef, post);
            })
        );

        // Step 4: Initialize each Post and save to the 'posts' collection under the user
        // const postsCollectionRef = collection(userRef, 'posts').withConverter(postConverter);
        // await Promise.all(
        //     postsData.map(async (postData) => {
        //         const post = new Post(postData.id, postData.author, postData.body, postData.dateCreated, postData.tags);
        //         await addDoc(postsCollectionRef, post);
        //     })
        // );


        console.log('User, pets, and posts added successfully');
    } catch (error) {
        console.error("Error registering user or adding documents:", error.code, error.message);
    }
}
  
async function signInUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
    } catch (error) {
      console.error("Error signing in user:", error.code, error.message);
    }
}


// ########################################################################################

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

const email = "johndoe@example.com";
const password = "securePassword";
const username = "JohnDoe";
const level = 1;

const petsData = [
    { id: "123123", level: "3", name: "joey", type: "dog", xp: "432" },
    { id: "456456", level: "2", name: "bella", type: "cat", xp: "210" }
];

const itemData = [
    {id: "123123", name: "something", cost: "cost", description: "description"}
];


const postsData = [
    { id: "543543", author: "1", body: "This is my first post!", dateCreated: "2023-01-01", tags: ["tag1", "tag2"], isPublic: "false" },
    { id: "654654", author: "1", body: "Enjoying the day with my pets.", dateCreated: "2023-02-15", tags: ["tag3", "tag4"],isPublic: "false" }
];

// Call the function
registerUser(auth, db, email, password, username, level, 0, 0, petsData, postsData);

// signInUser('johndoe@example.com', 'securePassword');

// ########################################################################################


app.listen(5100, () => {
    console.log("Listening");
});