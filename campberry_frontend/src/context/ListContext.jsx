import React, { createContext, useContext, useState } from 'react';

const ListContext = createContext(null);

export const ListProvider = ({ children }) => {
    // Array of list objects: { id: string, name: string, description: string, programs: string[] }
    const [userLists, setUserLists] = useState([
        { id: '1', name: 'My Top Choices', description: 'These are the programs I really want to attend next summer.', programs: [] }
    ]);

    // Set of saved program IDs for the universal bookmark star
    const [savedPrograms, setSavedPrograms] = useState(new Set());

    const createList = (name, description = '') => {
        const newList = {
            id: Date.now().toString(),
            name,
            description,
            programs: []
        };
        setUserLists(prev => [...prev, newList]);
        return newList;
    };

    const addProgramToList = (programId, listId) => {
        setUserLists(prev => prev.map(list => {
            if (list.id === listId) {
                // Prevent duplicates
                if (!list.programs.includes(programId)) {
                    return { ...list, programs: [...list.programs, programId] };
                }
            }
            return list;
        }));
    };

    const toggleSaveProgram = (programId) => {
        setSavedPrograms(prev => {
            const newSet = new Set(prev);
            if (newSet.has(programId)) {
                newSet.delete(programId);
            } else {
                newSet.add(programId);
            }
            return newSet;
        });
    };

    const isProgramSaved = (programId) => savedPrograms.has(programId);

    return (
        <ListContext.Provider value={{
            userLists,
            savedPrograms,
            createList,
            addProgramToList,
            toggleSaveProgram,
            isProgramSaved
        }}>
            {children}
        </ListContext.Provider>
    );
};

export const useListContext = () => useContext(ListContext);
