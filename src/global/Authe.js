import React, { useContext, useEffect, useState } from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import { auth, db } from '../config/config';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = React.createContext();

function Authe({children}) {
    const [userInfo, setUserinfo] = useState({
        user: null,
        isVerified: false
    });
    const [adminInfo, setAdmininfo] = useState({
        isAuth: false,
        admin: null
    })
    const getUserInfo = async (uid) => {
        const theDoc     = doc(db, "users", uid);
        await getDoc(theDoc).then(res => {
                setUserinfo({
                    user: res.data(),
                    isVerified: true
                })
                window.localStorage.clear();
                window.localStorage.setItem("AuthData", JSON.stringify({isAuth: true, gender: res.data().gender, apply: res.data().apply}))
        })
    }
    const getAdminInfo = async (uid) => {
        const theDoc = doc(db, "admins", uid);
        await getDoc(theDoc).then(res => {
            setAdmininfo({
                admin: res.data(),
                isAuth: true
            })
            window.localStorage.clear();
            window.localStorage.setItem("AuthInfo", JSON.stringify({isAuth: true, fullname: res.data().fullname}))
        })
    }
    const getRole    = async (uid) => {
        const theDoc = doc(db, "roles", uid);
        let role = await getDoc(theDoc).then(res => {
            return res.data().role
        })
        return role;
    }

    useEffect(() => {
        if (window.localStorage.getItem("AuthData")) {
            let AuthData = JSON.parse(window.localStorage.getItem("AuthData"));
            setUserinfo({
                user: {
                    gender: AuthData.gender,
                    apply: AuthData.apply
                },
                isVerified: AuthData.isAuth
            })
        }
        if (window.localStorage.getItem("AuthInfo")) {
            let AuthData = JSON.parse(window.localStorage.getItem("AuthInfo"));
            setAdmininfo({
                isAuth: AuthData.isAuth,
                admin: {
                    fullname: AuthData.fullname
                }
            })
        }
        let unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                if (user.emailVerified && !window.sessionStorage.getItem("isVerified")) {
                    getRole(user.uid)
                    .then(res => {
                        if (res === "user") {
                            getUserInfo(user.uid);
                        } else if (res === "admin") {
                            getAdminInfo(user.uid);
                        }
                    })
                } else {
                    setUserinfo({
                        user: null,
                        isVerified: false
                    })
                    setAdmininfo({
                        isAuth: false,
                        admin: null
                    })
                }
            } else {
                setUserinfo({
                    user: null,
                    isVerified: false
                })
                setAdmininfo({
                    isAuth: false,
                    admin: null
                })
            }
        })
        return () => {
            unsubscribe();
        }
    }, [])
    return (
        <AuthContext.Provider value={{userInfo, setUserinfo, adminInfo, setAdmininfo}}>
            {
                children
            }
        </AuthContext.Provider>
    )
}

const useAuthe = () => {
    return useContext(AuthContext)
}

export default Authe;

export {useAuthe};