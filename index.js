import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import 'dotenv/config'
import express from "express";
import cors from "cors";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { userConverter, User } from './classes/User.js';
import { Pet, petConverter } from './classes/Pet.js';
import { Post, postConverter } from './classes/Post.js';
import { Item, itemConverter } from './classes/Item.js';
import { Inventory, inventoryConverter } from './classes/Inventory.js';

import { checkComment } from './util/checkComment.js';

const PORT = 5100
const app = express();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  
};

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], // Allow these headers
    credentials: true // Allow cookies and credentials
}));


const appDB = initializeApp(firebaseConfig);
const db = getFirestore(appDB);
const auth = getAuth(appDB);
app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const auth = getAuth();
        const db = getFirestore();
        // console.log(req.body);
        let username = req.body.username;
        let coins = req.body.coins;
        let email = req.body.email;
        let level = req.body.level;
        let uid = req.body.uid;
        let xp = req.body.xp;

        // Step 2: Create user document in Firestore
        const newUser = new User(username, coins, email, level, uid, xp);
        const userRef = doc(db, 'users', uid).withConverter(userConverter);
        await setDoc(userRef, newUser);

        // Step 3: Create collections
        const petsCollectionRef = collection(userRef, 'pets').withConverter(petConverter);
        const postsCollectionRef = collection(userRef, 'posts').withConverter(postConverter);
        const inventoryCollectionRef = collection(userRef, 'inventory').withConverter(inventoryConverter);

        // Create the starter inventory item
        const starterItem = new Inventory("egyc7nx9JjsUYlvK4OF6", 1); // ID and quantity
        await addDoc(inventoryCollectionRef, starterItem);

        await Promise.all([
            // Create pets and their items
            ...petsData.map(async (petData) => {
                const pet = new Pet(
                    petData.id,
                    petData.level,
                    petData.name,
                    petData.type,
                    petData.xp
                );
                const petRef = await addDoc(petsCollectionRef, pet);
            }),

            // Create posts if needed
            ...(postsData || []).map(async (postData) => {
                const post = new Post(
                    postData.id,
                    postData.author,
                    postData.body,
                    postData.dateCreated,
                    postData.tags,
                    postData.isPublic
                );
                await addDoc(postsCollectionRef, post);
            })
        ]);

        // Return success response
        res.status(201).json({
            message: 'User registered successfully',
            uid: uid,
            user: newUser
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific Firebase Auth errors
        const errorCode = error.code;
        let errorMessage = 'Registration failed';
        
        switch (errorCode) {
            case 'auth/email-already-in-use':
                errorMessage = 'Email is already registered';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak';
                break;
            default:
                errorMessage = error.message;
        }
        res.status(400).json({
            error: errorMessage,
            code: errorCode
        });
    }
});

app.get('/inventory/:userId', async (req, res) => {
    try {
        const db = getFirestore();
        const userId = req.params.userId;
        console.log('Fetching inventory for user:', userId);

        // 1. Get all documents from the user's inventory collection
        const userInventoryRef = collection(db, 'users', userId, 'inventory');
        const inventorySnapshot = await getDocs(userInventoryRef);
        
        const userInventory = [];
        
        // Get each inventory document
        inventorySnapshot.forEach((doc) => {
            console.log('Inventory document:', doc.data());
            userInventory.push({
                inventoryId: doc.id,
                ...doc.data()
            });
        });

        console.log('User inventory documents:', userInventory);

        // 2. Get the item details for each inventory item
        const itemPromises = userInventory.map(async (inventoryItem) => {
            // Use id instead of itemId since that's how it's stored in your document
            const itemRef = doc(db, 'items', inventoryItem.id);
            const itemDoc = await getDoc(itemRef);
            
            if (itemDoc.exists()) {
                const itemData = itemDoc.data();
                return {
                    id: inventoryItem.id,  // This is the item's ID from your items collection
                    name: itemData.name,
                    cost: itemData.cost,
                    quantity: inventoryItem.quantity || 0,
                    inventoryId: inventoryItem.inventoryId  // This is the document ID from the inventory collection
                };
            }
            return null;
        });

        // Wait for all item details to be fetched
        const inventoryWithDetails = (await Promise.all(itemPromises))
            .filter(item => item !== null);

        console.log('Inventory with item details:', inventoryWithDetails);

        res.status(200).json({
            inventory: inventoryWithDetails,
            count: inventoryWithDetails.length
        });

    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({
            error: 'Failed to fetch inventory',
            message: error.message
        });
    }
});


app.post('/checkComment', async (req, res) => {
    console.log('Received comment check request');
    
    try {
        // Validate request
        if (!req.body) {
            console.error('No request body received');
            return res.status(400).json({
                error: 'No request body provided',
                safe: false
            });
        }

        if (!req.body.commentBody) {
            console.error('No comment body in request');
            return res.status(400).json({
                error: 'Comment body is required',
                safe: false
            });
        }

        console.log('Processing comment:', req.body.commentBody.substring(0, 50) + '...');

        // Try to check the comment
        const comment = req.body.commentBody;
        const result = await checkComment(comment);
        console.log('Check result:', result);

        const isSafe = String(result).toLowerCase().trim() === "true";
        console.log('Is comment safe:', isSafe);

        // Send response
        return res.status(200).json({
            message: isSafe ? 'Comment is safe' : 'Comment contains inappropriate content',
            safe: isSafe
        });
    } catch (error) {
        console.error('Error processing comment:', error);
        return res.status(500).json({
            error: 'Failed to process comment',
            details: error.message,
            safe: false
        });
    }
});


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

app.post('/addEntry', async (req, res) => {
    try {
        const db = getFirestore();
        
        // Extract data from request body
        const { text, authorId, isPublic, title } = req.body;

        // Validate required fields
        if (!text || !authorId) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Both text and authorId are required'
            });
        }

        // Reference to the user's posts collection
        const postsCollectionRef = collection(
            doc(db, 'users', authorId), 
            'posts'
        ).withConverter(postConverter);

        const postId = crypto.randomUUID();
        
        // Create new post object using the constructor properly
        const newPost = new Post(
            postId,           // id
            authorId,         // author
            title || '',      // title
            text,            // body
            new Date().toISOString(), // dateCreated
            [],              // tags
            isPublic         // isPublic
        );

        // Add the post to the collection
        const docRef = await addDoc(postsCollectionRef, newPost);

        // Return success response
        res.status(201).json({
            message: 'Post created successfully',
            postId: docRef.id,
            post: newPost
        });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            error: 'Failed to create post',
            message: error.message
        });
    }
});

app.get('/posts/public', async (req, res) => {
    try {
        const db = getFirestore();
        const publicPosts = [];

        // Get all users
        const usersSnapshot = await getDocs(collection(db, 'users'));

        // For each user, get their public posts
        await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
            const postsSnapshot = await getDocs(collection(doc(db, 'users', userDoc.id), 'posts'));
            
            postsSnapshot.docs.forEach((postDoc) => {
                const postData = postDoc.data();
                // console.log('Post data from Firestore:', postData); // Debug log
                
                // Only include public posts
                if (postData.isPublic) {
                    publicPosts.push({
                        id: postDoc.id,
                        userId: userDoc.id,
                        body: postData.text,  // Make sure this matches your Firestore field name
                        dateCreated: postData.dateCreated,
                        title: postData.title,
                        isPublic: postData.isPublic,
                        ...postData
                    });
                }
            });
        }));

        // Log the final array
        // console.log('Sending posts to client:', publicPosts);

        // Sort posts by date (newest first)
        publicPosts.sort((a, b) => {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        });

        res.status(200).json({
            posts: publicPosts,
            count: publicPosts.length
        });

    } catch (error) {
        console.error('Error fetching public posts:', error);
        res.status(500).json({
            error: 'Failed to fetch public posts',
            message: error.message
        });
    }
});

app.get('/posts/user/:userId', async (req, res) => {
    try {
        const db = getFirestore();
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({
                error: 'Missing user ID',
                message: 'User ID is required'
            });
        }

        // Get reference to the user's posts collection
        const postsSnapshot = await getDocs(
            collection(doc(db, 'users', userId), 'posts')
        );
        
        const userPosts = [];
        
        postsSnapshot.forEach((postDoc) => {
            const postData = postDoc.data();
            userPosts.push({
                id: postDoc.id,
                ...postData
            });
        });

        // Sort posts by date (newest first)
        userPosts.sort((a, b) => {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        });

        res.status(200).json({
            posts: userPosts,
            count: userPosts.length
        });

    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({
            error: 'Failed to fetch user posts',
            message: error.message
        });
    }
});

app.post('/comments', async (req, res) => {
    try {
        const db = getFirestore();
        
        // Extract data from request body
        const { postId, userId, authorId, commentBody } = req.body;

        // Validate required fields
        if (!postId || !userId || !authorId || !commentBody) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Post ID, User ID, Author ID, and comment body are required'
            });
        }

        // Reference to the comments collection of the specific post
        const commentsCollectionRef = collection(
            doc(db, 'users', userId, 'posts', postId), 
            'comments'
        );

        // Create comment data
        const commentData = {
            id: crypto.randomUUID(),
            author: authorId,
            body: commentBody,
            dateCreated: new Date().toISOString()
        };

        // Add comment to the comments collection of the post
        const docRef = await addDoc(commentsCollectionRef, commentData);

        // Return success response
        res.status(201).json({
            message: 'Comment added successfully',
            commentId: docRef.id,
            comment: commentData
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            error: 'Failed to add comment',
            message: error.message
        });
    }
});

app.get('/posts/:userId/:postId/comments', async (req, res) => {
    try {
        const db = getFirestore();
        const { userId, postId } = req.params;

        // Reference to the comments collection of the specific post
        const commentsRef = collection(
            doc(db, 'users', userId, 'posts', postId), 
            'comments'
        );
        
        const commentsSnapshot = await getDocs(commentsRef);

        const comments = [];
        commentsSnapshot.forEach((doc) => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort comments by date
        comments.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        res.status(200).json({
            comments,
            count: comments.length
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            error: 'Failed to fetch comments',
            message: error.message
        });
    }
});

app.get('/shop/items', async (req, res) => {
    try {
        const db = getFirestore();
        const itemsCol = collection(db, 'items');
        const itemsSnapshot = await getDocs(itemsCol);
        
        const items = [];
        itemsSnapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                title: doc.data().name,
                price: doc.data().cost,
                // Add any other fields you need
            });
        });

        res.status(200).json({ items });
    } catch (error) {
        console.error('Error fetching shop items:', error);
        res.status(500).json({ error: 'Failed to fetch shop items' });
    }
});



app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});