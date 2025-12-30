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
    serverTimestamp,
    orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../auth/AuthContext';
import { Assignment } from '../../types';
import { timestampToDate } from '../../utils/dateUtils';

export const useAssignments = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchAssignments = async () => {
        if (!currentUser) return;

        try {
            const assignmentsRef = collection(db, 'assignments');
            const q = query(
                assignmentsRef,
                where('userId', '==', currentUser.uid),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);

            const assignmentsData: Assignment[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userId: data.userId,
                    title: data.title,
                    subject: data.subject,
                    priority: data.priority,
                    dueDate: data.dueDate ? timestampToDate(data.dueDate) : null,
                    notes: data.notes,
                    createdAt: timestampToDate(data.createdAt),
                    status: data.status,
                };
            });

            setAssignments(assignmentsData);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [currentUser]);

    const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'userId' | 'createdAt'>) => {
        if (!currentUser) return;

        try {
            const assignmentsRef = collection(db, 'assignments');
            await addDoc(assignmentsRef, {
                ...assignmentData,
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
            });
            await fetchAssignments();
        } catch (error) {
            console.error('Error creating assignment:', error);
            throw error;
        }
    };

    const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
        try {
            const assignmentRef = doc(db, 'assignments', id);
            await updateDoc(assignmentRef, updates);
            await fetchAssignments();
        } catch (error) {
            console.error('Error updating assignment:', error);
            throw error;
        }
    };

    const deleteAssignment = async (id: string) => {
        try {
            const assignmentRef = doc(db, 'assignments', id);
            await deleteDoc(assignmentRef);
            await fetchAssignments();
        } catch (error) {
            console.error('Error deleting assignment:', error);
            throw error;
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
        await updateAssignment(id, { status: newStatus });
    };

    return {
        assignments,
        loading,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        toggleStatus,
        refetch: fetchAssignments,
    };
};
