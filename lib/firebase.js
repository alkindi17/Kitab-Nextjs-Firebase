import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: "AIzaSyAaslurSKcenB7aVzNAl5CMqyLyTEd6hMk",
	authDomain: "bloggy-17.firebaseapp.com",
	projectId: "bloggy-17",
	storageBucket: "bloggy-17.appspot.com",
	messagingSenderId: "1046951596342",
	appId: "1:1046951596342:web:7604e95e1b18d95093e397",
	measurementId: "G-RSV1F6W1M2"
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig)
}

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const increment = firebase.firestore.FieldValue.increment;

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp;

export async function getUserWithUsername(username) {
	const usersRef = firestore.collection('users');
	const query = usersRef.where('username', '==', username).limit(1);
	const userDoc = (await query.get()).docs[0];
	return userDoc;
}

export function postToJson(doc) {
	const data = doc.data();
	return {
		...data,
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis()
	}
}