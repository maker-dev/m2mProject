import React, { useEffect, useState } from 'react'
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth, rolesColl} from '../../config/config';
import { errAlt, infoAlt } from '../../utilities/Alerts';
import { errhandling } from '../../utilities/ErrorHandling';
import {getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuthe } from '../../global/Authe';
import Loader from '../../components/Loader';
function Admin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const adminInfo = useAuthe().adminInfo;
    useEffect(() => {
        if (adminInfo.isAuth) {
            setLoading(false);
            navigate("/Admin/Dashboard");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminInfo])
    const validation = () => {
        // eslint-disable-next-line no-useless-escape
        var emailRegex    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email) ||  password.length < 6) {
            return false;
        } else {
            return true;
        }
    }
    const checkingAdminRole   = async (email) => {
        let getUserRole = query(rolesColl, where("email", "==", email.toLowerCase()));
        let dicision = await getDocs(getUserRole)
        .then(res => {
            if (res.docs.length === 0) {
                return true;
            } else {
                if (res.docs[0].data().role === "user") {
                    return false;
                } else {
                    return true
                }
            }
        })
        return dicision;
    }
    const signin = async (e) => {
        e.preventDefault();
        if (!validation()) {
            errAlt("Fill The Form Correctly");
        } else {
            try {
                setLoading(true);
                let checking = await checkingAdminRole(email)
                .then(res => {
                    return res;
                })
                if (!checking) {
                    setLoading(false);
                    navigate("/Signin");
                    errAlt("You Must Login From Here");
                    return;
                }
                let user = await signInWithEmailAndPassword(auth, email, password)
                .then(user => {
                    return user.user;
                })
                if (!user.emailVerified) {
                    await signOut(auth);
                    setLoading(false);
                    navigate("/Verify");
                    infoAlt("You Must Verify Your Email");
                } 
            } catch(err) {
                setLoading(false);
                errhandling(err.code);
            }
        }

    }
    return (
        <>
            <section id='admin-login' className='d-flex justify-content-center align-items-center'>
                <div className="container">
                    <div className="row">
                    <div className="col-12 col-md-8 col-lg-6 m-auto">
                        <div className="card border-0 shadow p-2 border-radius">
                        <div className="card-body text-center">
                            <svg className="mx-auto my-3" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                            <form onSubmit={signin} autoComplete="off">
                                <input type="text" className="form-control my-4 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                                <input type="password" autoComplete='off'  className="form-control my-4 py-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                            <div className="text-center mt-3">
                                <button className="btn btn-primary text-uppercase">Login</button>
                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
            {loading && <Loader />}
        </>
    )
}

export default Admin