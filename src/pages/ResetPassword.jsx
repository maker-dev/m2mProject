import React, { useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../config/config';
import {errAlt, succAlt} from '../utilities/Alerts';
import {errhandling} from '../utilities/ErrorHandling';
import Loader from '../components/Loader';

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const validation = () => {
        // eslint-disable-next-line no-useless-escape
        var emailRegex    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return false;
        } else {
            return true;
        }
    }
    const sendEmail = async (e) => {
        e.preventDefault();
        if (!validation()) {
            errAlt("Fill The Form Correctly");
        } else {
            try {
                setLoading(true);
                await sendPasswordResetEmail(auth, email);
                setLoading(false);
                setEmail("");
                succAlt("Check Your Email To Reset");
            } catch(err) {
                setLoading(false);
                errhandling(err.code);
            }
        }
    }
    return (
    <>
        <Navbar />
        <main id='reset-password'>
            <div className="container">
                <div className="image-container">
                    {/*eslint-disable jsx-a11y/img-redundant-alt */}
                    <img src='/assets/icons/resetPass.png' alt='resetPassword Image' className='img-fluid'/>
                </div>
                <h2 className='text-center mt-2 title'>Reset Your Password</h2>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <p className='text-center mb-5 paragraph'>
                            Enter the email address associated with your account and we'll send 
                            you a link to reset your password.
                        </p>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <form autoComplete="off" onSubmit={sendEmail}>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <input type={"text"} 
                                placeholder="Email" 
                                className='form-control'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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

export default ResetPassword