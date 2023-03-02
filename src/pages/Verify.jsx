import React, { useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import {sendEmailVerification, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth} from '../config/config';
import Loader from '../components/Loader';
import {errAlt, infoAlt, succAlt} from '../utilities/Alerts';
import {errhandling} from '../utilities/ErrorHandling';
import { useNavigate } from 'react-router-dom';

function Verify() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const validation = () => {
        // eslint-disable-next-line no-useless-escape
        var emailRegex    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email) || password.length < 6) {
            return false;
        } else {
            return true;
        }
    }
    const sendVerifyEmail = async (auth, email, password) => {
        let user = await signInWithEmailAndPassword(auth, email, password)
        .then(user => user.user);
        if (!user.emailVerified) {
            await sendEmailVerification(user);
        } 
        await signOut(auth);
        return user.emailVerified;
    }
    const sendEmail = async (e) => {
        e.preventDefault();
        if (!validation()) {
            errAlt("Fill The Form Correctly");
        } else {
            try {
                window.sessionStorage.setItem("isVerified", true);
                setLoading(true);
                await sendVerifyEmail(auth, email, password).then(isVerify => {
                    if (isVerify) {
                        navigate("/signin");
                        infoAlt("You Already Verified");
                    } else {
                        succAlt("Check Your Email To Verify");
                    }
                })
                setEmail("");
                setPassword("");
                setLoading(false);
                window.sessionStorage.clear();
            } catch(err) {
                setLoading(false);
                errhandling(err.code);
                window.sessionStorage.clear();
            }
        }
    }

    return (
    <>
        <Navbar />
        <main id='verify-section'>
            <div className="container">
                <div className="image-container">
                    <img src='/assets/icons/verify.png' alt='verifyImage' className='img-fluid'/>
                </div>
                <h2 className='text-center mt-2 title'>Verify Your Email</h2>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <p className='text-center mb-5 paragraph'>
                            To ensure improved security, 
                            please verify your email address.
                            To do so, enter your email and click the verification link sent to you.
                        </p>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <form onSubmit={sendEmail} autoComplete="off">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <input type={"text"} 
                                placeholder="Email" 
                                className='form-control'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <input type={"password"} 
                                placeholder="Password" 
                                className='form-control'
                                autoComplete='off'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="text-center mt-3">
                                <button>Send</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
        {loading && <Loader />}
        <Footer />
    </>
    )
}

export default Verify