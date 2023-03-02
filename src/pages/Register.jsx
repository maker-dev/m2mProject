import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import {createUserWithEmailAndPassword, sendEmailVerification, signOut} from 'firebase/auth';
import {doc, serverTimestamp, setDoc} from 'firebase/firestore';
import {auth, db} from '../config/config';
import {succAlt, errAlt, infoAlt} from '../utilities/Alerts';
import {errhandling} from '../utilities/ErrorHandling';
function Register() {
    const [fullname, setFullname] = useState({
        firstname: "",
        lastname: ""
    });
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState({
        password: "",
        confirm: ""
    });
    const [loading, setLoading] = useState(false);
    const validation = () => {
        var usernameRegex = /^[a-zA-Z]+$/;
        // eslint-disable-next-line no-useless-escape
        var emailRegex    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!usernameRegex.test(fullname.firstname) || !usernameRegex.test(fullname.lastname)) {
            return false;
        } else if (!gender) {
            return false;
        } else if (!emailRegex.test(email)) {
            return false;
        } else if ((password.password !== password.confirm) || password.password.length < 6) {
            return false;
        }
        return true;
    }
    const registerUser = async (auth, email, password, firstname) => {
        let user = await createUserWithEmailAndPassword(auth, email, password)
        .then(user => user.user);
        await setDoc(doc(db, "users", user.uid), {
            fullname,
            email: email.toLowerCase(),
            gender, 
            createdAt: serverTimestamp(),
            inbox: [
                {
                    title: "Welcome",
                    createdAt: `${new Date().toDateString()}`,
                    to: `${firstname}`,
                    msg: `We are glad that you have decided to apply for the Company! We wish you good luck in the process.To access your application(s) and manage your data at this website, please use your email ${email} to sign in.`,
                    thanks: "Good Luck in the application process",
                    from: "m2mServices"
                }
            ],
            apply: {
                state: "visitor",
                job: ""
            }
        })
        await setDoc(doc(db, "roles", user.uid), {
            email: email.toLowerCase(),
            role: "user"
        })
        await sendEmailVerification(user);
    };
    const register = async (e) => {
        e.preventDefault();
        if (!validation()) {
            errAlt("Fill The Form Correctly");
        } else {
            try {
                setLoading(true);
                await registerUser(auth, email, password.password, fullname.firstname);
                await signOut(auth);
                setLoading(false);
                setFullname({firstname: "", lastname: ""});
                setGender("");
                setEmail("");
                setPassword({password: "", confirm: ""})
                succAlt("Account Has Been Created");
                window.setTimeout(() => {
                    infoAlt("Check Your Email To Verify");
                }, 1200)
            } catch(err) {
                setLoading(false);
                errhandling(err.code);
            }
    }

    }
    return (
    <>
    <Navbar />
    <main id='register-section'>
        <div className="container">
            <div className="row">
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-10 col-lg-8">
                    <div className="ui">
                        <h2 className='title text-center mb-5'><i className="fa-solid fa-user-plus mr-2"></i>Sign <span>Up</span></h2>
                        <form autoComplete='off' onSubmit={register}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input type={"text"} 
                                        placeholder="FirstName" 
                                        className='form-control'
                                        value={fullname.firstname}
                                        onChange={(e) => setFullname({...fullname, firstname: e.target.value})}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input type={"text"} 
                                        placeholder="LastName" 
                                        className='form-control' 
                                        value={fullname.lastname} 
                                        onChange={(e) => setFullname({...fullname, lastname: e.target.value})}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <select className='form-control' 
                                        value={gender} 
                                        onChange={(e) => setGender(e.target.value)}>
                                            <option value={""} disabled>Choose Your Gender</option>
                                            <option value={"Male"}>Male</option>
                                            <option value={"Female"}>Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <input type={"email"} 
                                        placeholder="Email" 
                                        className='form-control '
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <input type={"password"} 
                                        placeholder="Password" 
                                        className='form-control ' 
                                        value={password.password}
                                        autoComplete='off'
                                        onChange={e => setPassword({...password, password: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <input type={"password"} 
                                        placeholder="Confirm Password"  
                                        className='form-control '
                                        value={password.confirm}
                                        autoComplete="off"
                                        onChange={e => setPassword({...password, confirm: e.target.value})}/>
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
                                    <p className='text-center signin-link mt-2'>Already a User? <Link to={"/Signin"}>Sign In</Link></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className='verify-container text-center mt-2'>
                                        <Link to={"/Verify"}>Verify Email</Link>
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

export default Register