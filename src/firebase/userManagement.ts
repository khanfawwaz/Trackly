import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './config';

const USERS_COLLECTION = 'users';
const MAX_USERS = 400;
const INACTIVE_DAYS = 40;

/**
 * Check if user limit has been reached
 */
export const isUserLimitReached = async (): Promise<boolean> => {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    return snapshot.size >= MAX_USERS;
};

/**
 * Get current user count
 */
export const getUserCount = async (): Promise<number> => {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    return snapshot.size;
};

/**
 * Create user document in Firestore
 */
export const createUserDocument = async (userId: string, email: string): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
        email,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
    });
};

/**
 * Update user's last active timestamp
 */
export const updateLastActive = async (userId: string): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
        lastActiveAt: serverTimestamp(),
    }, { merge: true });
};

/**
 * Delete inactive users (not logged in for 40+ days)
 * This should be run periodically (e.g., via Cloud Functions or manual trigger)
 */
export const cleanupInactiveUsers = async (): Promise<number> => {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);

    const now = new Date();
    let deletedCount = 0;

    const deletePromises = snapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const lastActiveAt = userData.lastActiveAt as Timestamp;

        if (lastActiveAt) {
            const lastActiveDate = lastActiveAt.toDate();
            const daysSinceActive = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);

            if (daysSinceActive >= INACTIVE_DAYS) {
                // Delete user's data from all collections
                await deleteUserData(userDoc.id);
                deletedCount++;
            }
        }
    });

    await Promise.all(deletePromises);
    return deletedCount;
};

/**
 * Delete all user data from all collections
 */
const deleteUserData = async (userId: string): Promise<void> => {
    // Delete assignments
    const assignmentsRef = collection(db, 'assignments');
    const assignmentsQuery = query(assignmentsRef, where('userId', '==', userId));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    await Promise.all(assignmentsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete projects
    const projectsRef = collection(db, 'projects');
    const projectsQuery = query(projectsRef, where('userId', '==', userId));
    const projectsSnapshot = await getDocs(projectsQuery);
    await Promise.all(projectsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete internships
    const internshipsRef = collection(db, 'internships');
    const internshipsQuery = query(internshipsRef, where('userId', '==', userId));
    const internshipsSnapshot = await getDocs(internshipsQuery);
    await Promise.all(internshipsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete user document
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
};
