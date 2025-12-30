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
import { Project } from '../../types';
import { timestampToDate } from '../../utils/dateUtils';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchProjects = async () => {
        if (!currentUser) return;

        try {
            const projectsRef = collection(db, 'projects');
            const q = query(
                projectsRef,
                where('userId', '==', currentUser.uid),
                orderBy('startDate', 'desc')
            );
            const snapshot = await getDocs(q);

            const projectsData: Project[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userId: data.userId,
                    name: data.name,
                    description: data.description,
                    type: data.type,
                    startDate: timestampToDate(data.startDate),
                    dueDate: data.dueDate ? timestampToDate(data.dueDate) : null,
                    repoLink: data.repoLink,
                    notes: data.notes,
                    status: data.status,
                };
            });

            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [currentUser]);

    const createProject = async (projectData: Omit<Project, 'id' | 'userId'>) => {
        if (!currentUser) return;

        try {
            const projectsRef = collection(db, 'projects');
            await addDoc(projectsRef, {
                ...projectData,
                userId: currentUser.uid,
            });
            await fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        try {
            const projectRef = doc(db, 'projects', id);
            await updateDoc(projectRef, updates);
            await fetchProjects();
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    };

    const deleteProject = async (id: string) => {
        try {
            const projectRef = doc(db, 'projects', id);
            await deleteDoc(projectRef);
            await fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    };

    return {
        projects,
        loading,
        createProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects,
    };
};
