import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth, rolesColl} from '../config/config';
import {infoAlt, errAlt} from '../utilities/Alerts';
import {errhandling} from '../utilities/ErrorHandling';
import Loader from '../components/Loader';
import { useAuthe } from '../global/Authe';
import {getDocs, query, where } from 'firebase/firestore';

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const AuthInfo = useAuthe().userInfo;
    const navigate = useNavigate();
    useEffect(() => {
        if (AuthInfo.isVerified) {
            setLoading(false);
            navigate("/");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AuthInfo]);
    const validation = () => {
        // eslint-disable-next-line no-useless-escape
        var emailRegex    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email) ||  password.length < 6) {
            return false;
        } else {
            return true;
        }
    }
    const checkingUserRole   = async (email) => {
        let getUserRole = query(rolesColl, where("email", "==", email.toLowerCase()));
        let decision = await getDocs(getUserRole)
        .then(res => {
            if (res.docs.length === 0) {
                return true;
            } else {
                if (res.docs[0].data().role === "admin") {
                    return false;
                } else {
                    return true
                }
            }
        })
        return decision;
    }

    const signIn = async (e) => {
        e.preventDefault();
        if (!validation()) {
            errAlt("Fill The Form Correctly");
        } else {
            try {
                setLoading(true);
                await signOut(auth);
                let checking = await checkingUserRole(email)
                .then(res => {
                    return res;
                })
                if (!checking) {
                    setLoading(false);
                    navigate("/Admin");
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
            <Navbar />
            <main id='signin-section'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-1 col-lg-2"></div>
                        <div className="col-md-10 col-lg-8">
                            <div className="ui">
                                <h2 className='title text-center mb-5'><i className="fa-solid fa-user mr-2"></i>Sign <span>In</span></h2>
                                <form autoComplete='off' onSubmit={signIn}>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <input type={"email"}
                                                className={"form-control"}
                                                placeholder={"Email"}
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <input type={"password"} 
                                                className={"form-control"} 
                                                placeholder={"Password"}
                                                autoComplete="off"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group btn-container mt-3">
                                                <button>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <p className='text-center resetPass-link mt-2'>Forget Your Password? <Link to={"/ResetPassword"}>Here</Link></p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className='createAcc-container text-center mt-2'>
                                                <Link to={"/Register"}>Create Account</Link>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-1 col-lg-2"></div>
                    </div>
                </div>
            </main>
            {loading && <Loader />}
            <Footer />
        </>
    )
}

export default Signin