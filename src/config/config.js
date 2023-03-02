import {initializeApp} from 'firebase/app';
import {getFirestore, collection} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBQ8GhM_s3_I9Nibo-wwcOIi-fo7eqrQ28",
    authDomain: "m2mproject-f2537.firebaseapp.com",
    projectId: "m2mproject-f2537",
    storageBucket: "m2mproject-f2537.appspot.com",
    messagingSenderId: "189082892698",
    appId: "1:189082892698:web:deeb50c45bd2ded4b62223"
};

const app = initializeApp(firebaseConfig);

const auth       = getAuth(app); 
const db         = getFirestore(app);
const storage    = getStorage(app);

const usersColl  = collection(db, 'users');
const adminsColl = collection(db, "admins");
const rolesColl      = collection(db, "roles");
const newsColl   = collection(db, "news");

export {auth, db, storage, usersColl,adminsColl, rolesColl, newsColl};