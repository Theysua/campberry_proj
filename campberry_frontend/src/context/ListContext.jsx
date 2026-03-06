import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedPrograms, saveProgram, unsaveProgram, getMyLists, createList as apiCreateList, addListItem } from '../services/api';
import { useAuth } from './AuthContext';

const ListContext = createContext(null);

export const ListProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [userLists, setUserLists] = useState([]);
    const [savedPrograms, setSavedPrograms] = useState(new Set());
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            getSavedPrograms().then(res => {
                const programIds = res.map(sp => sp.program.id);
                setSavedPrograms(new Set(programIds));
            }).catch(console.error);

            getMyLists().then(res => {
                setUserLists(res);
            }).catch(console.error);
        } else {
            setSavedPrograms(new Set());
            setUserLists([]);
        }
    }, [isAuthenticated]);

    const createList = async (name, description = '') => {
        try {
            const newList = await apiCreateList(name, description);
            setUserLists(prev => [newList, ...prev]);
            return newList;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const addProgramToList = async (programId, listId) => {
        try {
            await addListItem(listId, programId);
            const lists = await getMyLists();
            setUserLists(lists);
            return lists.find(list => list.id === listId) || null;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const toggleSaveProgram = async (programId) => {
        try {
            const isSaved = savedPrograms.has(programId);
            if (isSaved) {
                await unsaveProgram(programId);
                setSavedPrograms(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(programId);
                    return newSet;
                });
            } else {
                await saveProgram(programId);
                setSavedPrograms(prev => {
                    const newSet = new Set(prev);
                    newSet.add(programId);
                    return newSet;
                });
            }
        } catch (e) {
            console.error("Failed to toggle save program", e);
        }
    };

    const isProgramSaved = (programId) => savedPrograms.has(programId);

    const toggleCompare = (program) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === program.id);
            if (exists) {
                return prev.filter(p => p.id !== program.id);
            } else {
                if (prev.length >= 3) {
                    // Max 3 for comparison usually
                    alert("You can only compare up to 3 programs at a time.");
                    return prev;
                }
                return [...prev, program];
            }
        });
    };

    const clearCompare = () => setCompareList([]);

    return (
        <ListContext.Provider value={{
            userLists,
            savedPrograms,
            createList,
            addProgramToList,
            toggleSaveProgram,
            isProgramSaved,
            compareList,
            toggleCompare,
            clearCompare
        }}>
            {children}
        </ListContext.Provider>
    );
};

export const useListContext = () => useContext(ListContext);
