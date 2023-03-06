/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {useParams } from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore'
import { db } from '../../config/config';
import Loader from '../../components/Loader';

function ViewProfile() {
    const [userInfo, setUserinfo] = useState({
        id: "",
        fullname: {
            firstname: "",
            lastname: ""
        },
        gender: "",
        apply: {
            job: "",
            state: ""
        },
        birth: {
            date: "",
            place: ""
        },
        cv: "#",
        education: "",
        email: "",
        isOld: false,
        medicalInfo: "",
        phonenumber: "",
        place: {
            address: "",
            city: "",
            housenumber: "",
            postalcode: ""
        },
        secondaryInfo: {
            facebookLink: "",
            linkedinLink: "",
            secondaryemail: ""
        },
        workExp: ""
    });
    const [UndefinedUser, setUndefinedUser] = useState(false);
    const {userid} = useParams();
    useEffect(() => {
        let TheDoc = doc(db, "users", userid);
        getDoc(TheDoc)
        .then(res => {
            if (res.data() === undefined) {
                setUndefinedUser(true);
            } else {
                setUserinfo({id: res.id,...res.data()});
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userid]);
    if (UndefinedUser) {
        return (
            <main id='view-profile' className='p-0'>
                <div className="container vh-100 d-flex justify-content-center align-items-center">
                    <div className="alert alert-danger p-5 text-center" role="alert">
                        This User Is Not Registered
                    </div>
                </div>
            </main>
        )
    }
    if (!userInfo.id) {
        return (
            <Loader />
        )
    } else {
        return (
                <main id='view-profile'>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow">
    
                                    <div className="card-body">
                                        <div className="card-title mb-4">
                                            <div className="d-flex justify-content-start">
                                                <div className="image-container">
                                                    <img src={userInfo.profileImg ? userInfo.profileImg : userInfo.gender === "Male" ? "/assets/profileImage/view-male.jpg" : "/assets/profileImage/view-female.jpg"} alt='profileImage' id="imgProfile" className='br-8' />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="d-block font-weight-bold text-capitalize userName">{`${userInfo.fullname.firstname} ${userInfo.fullname.lastname}`}</h3>
                                                    <h6 className="d-block text-muted">Job: {userInfo.apply.job}</h6>
                                                    <h6 className="d-block text-muted">{userInfo.isOld ? "Old Employee" : "New Employee"}</h6>
                                                    <a className='btn btn-info text-white' href={userInfo.cv} target={'_blank'}>Go To Cv</a>
                                                </div>
                                            </div>
                                        </div>
    
                                        <div className="row">
                                            <div className="col-12">
                                                <ul className="nav nav-tabs mb-4">
                                                    <li className="nav-item">
                                                        <div className="nav-link active titles text-primary">Basic Info</div>
                                                    </li>
                                                </ul>
                                                <div className="ml-1">
                                                        <div className="row">
                                                            <div className="col-sm-3 col-5 col-md-2">
                                                                <label className='font-weight-bold text-secondary'>Full Name</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.fullname.firstname} {userInfo.fullname.lastname}
                                                            </div>
                                                        </div>
                                                        <hr />
    
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>Gender</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.gender}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>Birth Date</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.birth.date}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        
                                                        
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>Region</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.birth.place}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>city</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.place.city}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>address</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.place.address}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>postalCode</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.place.postalcode}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>houseNbr</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.place.housenumber}
                                                            </div>
                                                        </div>
    
                                                    </div>
    
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 mt-5">
                                                <ul className="nav nav-tabs mb-4">
                                                    <li className="nav-item">
                                                        <div className="nav-link active titles text-info">Contact</div>
                                                    </li>
                                                </ul>
                                                <div className="ml-1">
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>1ºEmail</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.email}
                                                            </div>
                                                        </div>
                                                        <hr />
    
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>2ºEmail</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.secondaryInfo.secondaryemail ? userInfo.secondaryInfo.secondaryemail : "Unselected"}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        
                                                        
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>Phone</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.phonenumber}
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
                                                        <div className="nav-link active titles text-warning">Social Media</div>
                                                    </li>
                                                </ul>
                                                <div className="ml-1">
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>Facebook</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.secondaryInfo.facebookLink ? <a href={userInfo.secondaryInfo.facebookLink} target={'_blank'}>{userInfo.fullname.firstname}'s Facebook</a> : "Unselected"}
                                                            </div>
                                                        </div>
                                                        <hr />
    
                                                        <div className="row">
                                                            <div className="col-sm-3 col-md-2 col-5">
                                                                <label className='font-weight-bold text-secondary'>Linkedin</label>
                                                            </div>
                                                            <div className="col-md-8 col-6">
                                                                {userInfo.secondaryInfo.linkedinLink ? <a href={userInfo.secondaryInfo.linkedinLink} target={'_blank'}>{userInfo.fullname.firstname}'s Linkedin</a> : "Unselected"}
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
                                                        <div className="nav-link active titles text-success">Education</div>
                                                    </li>
                                                </ul>
                                                <div className="ml-1">
                                                        <div className="row">
                                                            <div className="col-10">
                                                                {userInfo.education}
                                                            </div>
                                                        </div>
    
                                                    </div>
    
                                            </div>
                                        </div>
    
                                        <div className="row">
                                            <div className="col-12 mt-5">
                                                <ul className="nav nav-tabs mb-4">
                                                    <li className="nav-item">
                                                        <div className="nav-link active titles text-dark">Experience</div>
                                                    </li>
                                                </ul>
                                                <div className="ml-1">
                                                        <div className="row">
                                                            <div className="col-10">
                                                                {userInfo.workExp}
                                                            </div>
                                                        </div>
    
                                                    </div>
    
                                            </div>
                                        </div>
    
                                        <div className="row">
                                            <div className="col-12 mt-5">
                                                <ul className="nav nav-tabs mb-4">
                                                    <li className="nav-item">
                                                        <div className="nav-link active titles text-danger">Medical Info</div>
                                                    </li>
                                                </ul>
                                                <div className="ml-1">
                                                        <div className="row">
                                                            <div className="col-10">
                                                                {userInfo.medicalInfo}
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
}

export default ViewProfile