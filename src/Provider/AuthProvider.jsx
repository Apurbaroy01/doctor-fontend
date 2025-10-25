
import { useEffect, useState } from 'react';

import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import auth from '../firebase';
import AuthConText from './AuthConText';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("User:", user || "NO User")
            setUser(user)
            setLoading(false)
        });
        return unsubscribe;
    }, []);

    const logOut = () => {
        return signOut(auth)
    };

    const AuthInfo = {
        logOut,
        signIn,
        loading,
        user,
    };

    return (
        <AuthConText.Provider value={AuthInfo}>
            {children}
        </AuthConText.Provider>
    );
};

export default AuthProvider;