
import { useEffect, useState } from 'react';

import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from 'firebase/auth';
import auth from '../firebase';
import AuthConText from './AuthConText';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    };

    const updatauser = (UpateProfile) => {
        return updateProfile(auth.currentUser, UpateProfile)
    };

    // ✅ Secure update password with reauthentication
    const updatePass = async (currentPassword, newPassword) => {
        if (!auth.currentUser) {
            return;
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        // Reauthenticate first
        await reauthenticateWithCredential(user, credential);

        // Then update password
        return updatePassword(user, newPassword);
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
        updatauser,
        updatePass,
    };

    return (
        <AuthConText.Provider value={AuthInfo}>
            {children}
        </AuthConText.Provider>
    );
};

export default AuthProvider;