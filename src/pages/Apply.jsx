/* eslint-disable jsx-a11y/img-redundant-alt */
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader';
import { auth, db } from '../config/config'
import { useAuthe } from '../global/Authe'
import {infoAlt} from '../utilities/Alerts';
import {errhandling} from '../utilities/ErrorHandling';
function Apply() {
    const userInfo = useAuthe().userInfo.user;
    const setInfo  = useAuthe().setUserinfo;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let content = null;
    const dataValidation = () => {
        var usernameRegex = /^[a-zA-Z]+$/;
        if (!(usernameRegex.test(userInfo.fullname.lastname) && usernameRegex.test(userInfo.fullname.firstname) &&
            userInfo.cv && userInfo.place.address && userInfo.place.city && userInfo.place.housenumber &&
            userInfo.place.postalcode && userInfo.birth.date && userInfo.birth.place && userInfo.phonenumber &&
            userInfo.workExp && userInfo.education && userInfo.medicalInfo)
            ) {
                return false;
            } else {
                return true;
            }
    }
    const applyForJob = async (job) => {
        if (!dataValidation()) {
            navigate("/Profile");
            infoAlt("Feed Your Profile First");
            return ;
        }
        try {
            setLoading(true);
            let theDoc = doc(db, "users", auth.currentUser.uid);
            await updateDoc(theDoc, {
                apply: {
                    job,
                    state: "pending"
                }
            })
            if (userInfo.inbox.length < 2) {
    
                await updateDoc(theDoc, {
                    inbox: [
                        ...userInfo.inbox,
                        {
                            title: "Application Has Been Submitted",
                            createdAt: `${new Date().toDateString()}`,
                            to: `${userInfo.fullname.firstname}`,
                            msg: "Your application has been successfully submitted. We will start working with the application and inform you about the next steps as soon as possible. Applications from more than one account registered to our system will be rejected during the technical check.",
                            thanks: "Good Luck In Your Application",
                            from: "m2mServices"
                        }
                    ]
                })
                setInfo({
                    isVerified: true,
                    user: {
                        ...userInfo,
                        apply: {
                            job,
                            state: "pending"
                        },
                        inbox: [
                            ...userInfo.inbox,
                            {
                                title: "Application Has Been Submitted",
                                createdAt: `${new Date().toDateString()}`,
                                to: `${userInfo.fullname.firstname}`,
                                msg: "Your application has been successfully submitted. We will start working with the application and inform you about the next steps as soon as possible. Applications from more than one account registered to our system will be rejected during the technical check.",
                                thanks: "Good Luck In Your Application",
                                from: "m2mServices"
                            }
                        ]
                    }
                })
                
            } else {
                setInfo({
                    isVerified: true,
                    user: {
                        ...userInfo,
                        apply: {
                            job,
                            state: "pending"
                        }
                    }
                })
            }
    
            window.localStorage.setItem("AuthData", JSON.stringify({
                isAuth: true,
                gender: userInfo.gender,
                apply: {
                    job,
                    state: "pending"
                }
            }))
            setLoading(false);

        } catch(err) {
            setLoading(false);
            errhandling(err.code);
        }

    }

    const withdrawApp = async () => {
        try {
            setLoading(true);
            let theDoc = doc(db, "users", auth.currentUser.uid);
            await updateDoc(theDoc, {
                apply: {
                    state: "visitor",
                    job: ""
                }
            })
            setInfo({
                isVerified: true,
                user: {
                    ...userInfo,
                    apply: {
                        state: "visitor",
                        job: ""
                    }
                }
            })
            window.localStorage.setItem("AuthData", JSON.stringify({
                isAuth: true,
                gender: userInfo.gender,
                apply: {
                    state: "visitor",
                    job: ""
                }
            }))
            setLoading(false);
        } catch(err) {
            setLoading(false);
            errhandling(err.code);
        }
    }

    if (userInfo.apply.state === "visitor") {
        content =   <main className='apply'>
                        <h2 className='title'>Apply <span>Now</span></h2>
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4 m-auto">
                                <div className="card border-0 shadow text-center mb-lg-0 mb-4">
                                    <div className="card-body">
                                        <img src='/assets/icons/security.svg' alt='job image' />
                                        <h3>Security</h3>
                                        <button className='mt-2' onClick={() => applyForJob("security")}>Apply</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4 m-auto">
                                <div className="card border-0 shadow text-center mb-lg-0 mb-4">
                                    <div className="card-body">
                                        <img src='/assets/icons/hostess.svg' alt='job image' />
                                        <h3>Hostess</h3>
                                        <button className='mt-2' onClick={() => applyForJob("hostess")}>Apply</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4 m-auto">
                                <div className="card border-0 shadow text-center mb-lg-0 mb-4">
                                    <div className="card-body">
                                        <img src='/assets/icons/dog-trainer.svg' alt='job image' />
                                        <h3>Dog Trainer</h3>
                                        <button className='mt-2' onClick={() => applyForJob("dog trainer")}>Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>  
    } else if (userInfo.apply.state === "pending") {
        let imgSrc = userInfo.apply.job === "dog trainer" ? "dog-trainer" : userInfo.apply.job;
        content =   <main className='apply-pending'>
                        <h2 className='title'><span><i className="fa-solid fa-paperclip mr-2"></i></span>Pending</h2>
                        <div className="row">
                            <div className="col">
                                <div className="result-container">
                                    <div className="header">
                                        <h4 className='text-muted'><i className="fa-solid fa-check mr-1"></i>The Application Has Been Sent</h4>
                                        <div className="actions">
                                            <button className='mr-2 btn btn-danger' onClick={withdrawApp}>Withdraw application</button>
                                            <Link to={"/Profile"} className="btn btn-info">View</Link>
                                        </div>
                                    </div>
                                    <hr className='my-5'/>
                                    <div className="footer mt-3">
                                        <div className="icon-box">
                                            <div className="icon">
                                                <img src={`/assets/icons/${imgSrc}.svg`} alt='job image' />
                                            </div>
                                            <h4 className='title'>
                                                {userInfo.apply.job}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

    } else if (userInfo.apply.state === "accepted") {
        let imgSrc = userInfo.apply.job === "dog trainer" ? "dog-trainer" : userInfo.apply.job;
        content =   <main className='apply-accepted'>
                        <h2 className='title'><span><i className="fa-solid fa-circle-check mr-2"></i></span>Accepted</h2>
                        <div className="row">
                            <div className="col">
                                <div className="result-container">
                                    <div className="header">
                                        <h4 className='text-success'><i className="fa-solid fa-check mr-1"></i>The Application Has Been Accepted</h4>
                                        <div className="actions">
                                            <Link to={"/Inbox"} className="btn btn-info">Inbox</Link>
                                        </div>
                                    </div>
                                    <hr className='my-5'/>
                                    <div className="footer mt-3">
                                        <div className="icon-box">
                                            <div className="icon">
                                                <img src={`/assets/icons/${imgSrc}.svg`} alt='job image' />
                                            </div>
                                            <h4 className='title'>
                                                {
                                                    userInfo.apply.job
                                                }
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
    } else if (userInfo.apply.state === "rejected") {
        let imgSrc = userInfo.apply.job === "dog trainer" ? "dog-trainer" : userInfo.apply.job;
        content =   <main className='apply-rejected'>
                        <h2 className='title'><span><i class="fa-solid fa-circle-xmark mr-2"></i></span>Rejected</h2>
                        <div className="row">
                            <div className="col">
                                <div className="result-container">
                                    <div className="header">
                                        <h4 className='text-danger'><i class="fa-solid fa-xmark mr-2"></i>The Application Has Been Rejected</h4>
                                        <div className="actions">
                                            <Link to={"/Inbox"} className="btn btn-info">Inbox</Link>
                                        </div>
                                    </div>
                                    <hr className='my-5'/>
                                    <div className="footer mt-3">
                                        <div className="icon-box">
                                            <div className="icon">
                                                <img src={`/assets/icons/${imgSrc}.svg`} alt='job image' />
                                            </div>
                                            <h4 className='title'>
                                                {
                                                    userInfo.apply.job
                                                }
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
    }
    
    return (
        <>  
            <Navbar />
            <section id='apply-section'>
                <div className="container">
                    {
                        content
                    }
                </div>
            </section>
            {loading && <Loader />}
            <Footer />
        </>
    )
}

export default Apply