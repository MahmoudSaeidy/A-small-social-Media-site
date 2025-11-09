// context/PostContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const refreshPosts = useCallback(() => {
        setShouldRefresh(prev => !prev);
    }, []);

    return (
        <PostContext.Provider value={{ shouldRefresh, refreshPosts }}>
            {children}
        </PostContext.Provider>
    );
};

// تأكد من أن هذا الـ export موجود
export const usePost = () => {
    const context = useContext(PostContext);
    if (context === undefined) {
        throw new Error('usePost must be used within a PostProvider');
    }
    return context;
};