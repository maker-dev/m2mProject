/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore'
import { db } from '../../config/config';
function ViewProfile() {
    const [userInfo, setUserinfo] = useState({});
    const {userid} = useParams();
    useEffect(() => {
        let TheDoc = doc(db, "users", userid);
        getDoc(TheDoc)
        .then(res => {
            setUserinfo({...res.data()});
        })
    }, [userid])
    return (
        <main id='view-profile'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">

                            <div className="card-body">
                                <div className="card-title mb-4">
                                    <div className="d-flex justify-content-start">
                                        <div className="image-container rounded">
                                            <img src="" alt='profileImage' id="imgProfile"  />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="d-block font-weight-bold">Anas Draiaf</h3>
                                            <h6 className="d-block ">Job: hostess</h6>
                                            <h6 className="d-block">New Employee</h6>
                                            <a className='btn btn-info' href='#' target={'_blank'}>Go To Cv</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <ul className="nav nav-tabs mb-4">
                                            <li className="nav-item">
                                                <div className="nav-link active">Basic Info</div>
                                            </li>
                                        </ul>
                                        <div className="ml-1">
                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>Full Name</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        Jamshaid Kamran
                                                    </div>
                                                </div>
                                                <hr />

                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>Birth Date</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        March 22, 1994.
                                                    </div>
                                                </div>
                                                <hr />
                                                
                                                
                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>Gender</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        Male
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>Region</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        Morocco
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>city</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        el jadida
                                                    </div>
                                                </div>

                                            </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 mt-5">
                                        <ul className="nav nav-tabs mb-4">
                                            <li className="nav-item">
                                                <div className="nav-link active">Contact</div>
                                            </li>
                                        </ul>
                                        <div className="ml-1">
                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>Primary Email</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        Jamshaid Kamran
                                                    </div>
                                                </div>
                                                <hr />

                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>second Email</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        March 22, 1994.
                                                    </div>
                                                </div>
                                                <hr />
                                                
                                                
                                                <div className="row">
                                                    <div className="col-sm-3 col-md-2 col-5">
                                                        <label className='font-weight-bold'>PhoneNumber</label>
                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        Male
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 mt-5">
                                        <ul className="nav nav-tabs mb-4">
                                            <li className="nav-item">
                                                <div className="nav-link active">Education</div>
                                            </li>
                                        </ul>
                                        <div className="ml-1">
                                                <div className="row">
                                                    <div className="col-10">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi eos atque tenetur molestias illum doloribus quidem temporibus deleniti ducimus ipsa.
                                                    </div>
                                                </div>

                                            </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 mt-5">
                                        <ul className="nav nav-tabs mb-4">
                                            <li className="nav-item">
                                                <div className="nav-link active">Experience</div>
                                            </li>
                                        </ul>
                                        <div className="ml-1">
                                                <div className="row">
                                                    <div className="col-10">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi eos atque tenetur molestias illum doloribus quidem temporibus deleniti ducimus ipsa.
                                                    </div>
                                                </div>

                                            </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 mt-5">
                                        <ul className="nav nav-tabs mb-4">
                                            <li className="nav-item">
                                                <div className="nav-link active">Medical Info</div>
                                            </li>
                                        </ul>
                                        <div className="ml-1">
                                                <div className="row">
                                                    <div className="col-10">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi eos atque tenetur molestias illum doloribus quidem temporibus deleniti ducimus ipsa.
                                                    </div>
                                                </div>

                                            </div>

                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ViewProfile