import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../auth/AuthContext';
import { Internship } from '../../types';
import { timestampToDate } from '../../utils/dateUtils';

export const useInternships = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchInternships = async () => {
        if (!currentUser) return;

        try {
            const internshipsRef = collection(db, 'internships');
            const q = query(
                internshipsRef,
                where('userId', '==', currentUser.uid),
                orderBy('applicationDate', 'desc')
            );
            const snapshot = await getDocs(q);

            const internshipsData: Internship[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userId: data.userId,
                    company: data.company,
                    role: data.role,
                    platform: data.platform,
                    applicationDate: timestampToDate(data.applicationDate),
                    status: data.status,
                    interviewDate: data.interviewDate ? timestampToDate(data.interviewDate) : null,
                    notes: data.notes,
                };
            });

            setInternships(internshipsData);
        } catch (error) {
            console.error('Error fetching internships:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, [currentUser]);

    const createInternship = async (internshipData: Omit<Internship, 'id' | 'userId'>) => {
        if (!currentUser) return;

        try {
            const internshipsRef = collection(db, 'internships');
            await addDoc(internshipsRef, {
                ...internshipData,
                userId: currentUser.uid,
            });
            await fetchInternships();
        } catch (error) {
            console.error('Error creating internship:', error);
            throw error;
        }
    };

    const updateInternship = async (id: string, updates: Partial<Internship>) => {
        try {
            const internshipRef = doc(db, 'internships', id);
            await updateDoc(internshipRef, updates);
            await fetchInternships();
        } catch (error) {
            console.error('Error updating internship:', error);
            throw error;
        }
    };

    const deleteInternship = async (id: string) => {
        try {
            const internshipRef = doc(db, 'internships', id);
            await deleteDoc(internshipRef);
            await fetchInternships();
        } catch (error) {
            console.error('Error deleting internship:', error);
            throw error;
        }
    };

    return {
        internships,
        loading,
        createInternship,
        updateInternship,
        deleteInternship,
        refetch: fetchInternships,
    };
};
