/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { getSavedLists, getSavedPrograms, saveList, saveProgram, unsaveList, unsaveProgram, getMyLists, createList as apiCreateList, addListItem } from '../services/api';
import { useAuth } from './AuthContext';

const ListContext = createContext(null);

export const ListProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [userLists, setUserLists] = useState([]);
    const [savedPrograms, setSavedPrograms] = useState(new Set());
    const [savedLists, setSavedLists] = useState([]);
    const [savedListIds, setSavedListIds] = useState(new Set());
    const [compareList, setCompareList] = useState([]);
    const [listsLoading, setListsLoading] = useState(false);

    const refreshLists = useCallback(async () => {
        if (!isAuthenticated) {
            setUserLists([]);
            return [];
        }

        setListsLoading(true);
        try {
            const lists = await getMyLists();
            setUserLists(lists);
            return lists;
        } catch (e) {
            console.error('Failed to refresh user lists', e);
            throw e;
        } finally {
            setListsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            getSavedPrograms().then(res => {
                const programIds = res.map(sp => sp.program.id);
                setSavedPrograms(new Set(programIds));
            }).catch(console.error);

            getSavedLists().then(res => {
                const lists = res.map(entry => entry.list);
                setSavedLists(lists);
                setSavedListIds(new Set(lists.map(list => list.id)));
            }).catch(console.error);

            refreshLists().catch(() => {});
        } else {
            setSavedPrograms(new Set());
            setSavedLists([]);
            setSavedListIds(new Set());
            setUserLists([]);
            setListsLoading(false);
        }
    }, [isAuthenticated, refreshLists]);

    const createList = async (name, description = '') => {
        try {
            const newList = await apiCreateList(name, description);
            await refreshLists();
            return newList;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const addProgramToList = async (programId, listId) => {
        try {
            await addListItem(listId, programId);
            const lists = await refreshLists();
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

    const toggleSaveList = async (list) => {
        try {
            const listId = typeof list === 'string' ? list : list.id;
            const isSaved = savedListIds.has(listId);

            if (isSaved) {
                await unsaveList(listId);
                setSavedLists(prev => prev.filter(entry => entry.id !== listId));
                setSavedListIds(prev => {
                    const next = new Set(prev);
                    next.delete(listId);
                    return next;
                });
                return false;
            }

            await saveList(listId);

            let savedEntry = typeof list === 'string' ? null : list;
            if (!savedEntry) {
                const refreshed = await getSavedLists();
                const lists = refreshed.map(entry => entry.list);
                setSavedLists(lists);
                setSavedListIds(new Set(lists.map(entry => entry.id)));
                return true;
            }

            setSavedLists(prev => [savedEntry, ...prev.filter(entry => entry.id !== listId)]);
            setSavedListIds(prev => {
                const next = new Set(prev);
                next.add(listId);
                return next;
            });
            return true;
        } catch (e) {
            console.error('Failed to toggle save list', e);
            throw e;
        }
    };

    const isListSaved = (listId) => savedListIds.has(listId);

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
            listsLoading,
            savedPrograms,
            savedLists,
            refreshLists,
            createList,
            addProgramToList,
            toggleSaveProgram,
            isProgramSaved,
            toggleSaveList,
            isListSaved,
            compareList,
            toggleCompare,
            clearCompare
        }}>
            {children}
        </ListContext.Provider>
    );
};

export const useListContext = () => useContext(ListContext);
