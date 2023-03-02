/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
//eslint-disable jsx-a11y/anchor-is-valid 
// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import {errAlt, infoAlt, succAlt} from '../utilities/Alerts';
import {auth, db, storage} from '../config/config';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { deleteField, doc, updateDoc } from 'firebase/firestore';
import { useAuthe } from '../global/Authe';
import {errhandling} from '../utilities/ErrorHandling';

function Profile() {
    //loading
    const [loading, setLoading] = useState(false);
    //files
    const [imageFile, setImagefile] = useState();
    const [pdfFile, setPdffile] = useState();
    useEffect(() => {
        if (imageFile) UploadImage(imageFile);
    }, [imageFile])
    
    useEffect(() => {
        if (pdfFile) UploadPdf(pdfFile);
    }, [pdfFile])
    //Auth hook
    const userInfo = useAuthe().userInfo.user;
    const setUserInfo = useAuthe().setUserinfo;
    //user state
    const [fullname, setFullname] = useState({
        firstname: "",
        lastname: ""
    });
    const [place, setPlace] = useState({
        address: "",
        housenumber: "",
        postalcode: "",
        city: ""
    });
    const [birth, setBirth] = useState({
        place: "",
        date: ""
    });
    const [phonenumber, setPhonenumber] = useState("");
    const [secondaryInfo, setSecondaryinfo] = useState({
        secondaryemail: "",
        facebookLink: "",
        linkedinLink: ""
    });
    const [workExp, setWorkexp] = useState("");
    const [education, setEducation] = useState("");
    const [medicalInfo, setMedicalinfo] = useState("");
    const [isOld, setIsold] = useState(false);
    useEffect(() => {
        if (userInfo.fullname) {
            setFullname(userInfo.fullname);
        }
        if (userInfo.place) {
            setPlace(userInfo.place);
        }
        if (userInfo.birth) {
            setBirth(userInfo.birth);
        }
        if (userInfo.phonenumber) {
            setPhonenumber(userInfo.phonenumber);
        }
        if (userInfo.secondaryInfo) {
            setSecondaryinfo(userInfo.secondaryInfo);
        }
        if (userInfo.workExp) {
            setWorkexp(userInfo.workExp);
        }
        if (userInfo.education) {
            setEducation(userInfo.education);
        }
        if (userInfo.medicalInfo) {
            setMedicalinfo(userInfo.medicalInfo)
        }
        if (userInfo.isOld) {
            setIsold(userInfo.isOld);
        }
    }, [userInfo])
    const checkIfApply = () => {
        if (userInfo.apply.state === "visitor") {
            return true;
        } else {
            if (userInfo.apply.state === "pending") {
                return false;
            } else {
                return true;
            }
        }
    }
    const UploadImage = async (file) => {
        if (!checkIfApply()) {
            infoAlt("You Must Withdraw First");
            setImagefile();
            return;
        }
        setLoading(true);
        if (!(parseInt(file.size / 1000) <= 300)) {
            setLoading(false);
            errAlt("This Image Is Large");
            return;
        } else if (file.type !== "image/png") {
            setLoading(false);
            errAlt("Only Png Files Accepted");
            return;
        }
        let Verify = await new Promise(resolve => {
            let img = new Image();
            img.src = window.URL.createObjectURL(file);
            img.onload = function () {
                resolve((img.naturalWidth === img.naturalHeight))   
            }
        })
        .then(res => {
            return res;
        })
        if (!Verify) {
            setLoading(false);
            errAlt("Dimensions Aren't The Same");
            return;
        }
        try {
            let imageRef = ref(storage, `users/${auth.currentUser.uid}/profileImg.png`);
            await uploadBytes(imageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                        let theDoc = doc(db, "users", auth.currentUser.uid);
                        updateDoc(theDoc, {
                            profileImg: url
                        })
                        setUserInfo({
                            isVerified: true,
                            user: {
                                ...userInfo,
                                profileImg: url
                            }
                        })
                    });
                });
            setLoading(false);
        } catch (err) {
            setLoading(false);
            errhandling(err.code)
        }

    } 
    const DeleteImage = async () => {
        if (!checkIfApply()) {
            infoAlt("You Must Withdraw First");
            return;
        }
        setLoading(true);
        if (!userInfo.profileImg) {
            setLoading(false);
            errAlt("You Don't Have Profile Image");
            return;
        }
        try {
            let profileImage = ref(storage, `users/${auth.currentUser.uid}/profileImg.png`);
            await deleteObject(profileImage);
            let theDoc = doc(db, "users", auth.currentUser.uid);
            await updateDoc(theDoc, {
                profileImg: deleteField()
            })
            setUserInfo({
                isVerified: true,
                user: {
                    ...userInfo,
                    profileImg: undefined
                }
            })
            setImagefile();
            setLoading(false);
        } catch(err) {
            setLoading(false);
            errhandling(err.code);
        }
    }

    const UploadPdf  = async (file) => {
        if (!checkIfApply()) {
            infoAlt("You Must Withdraw First");
            setPdffile();
            return;
        }
        setLoading(true);
        if (!(parseInt(file.size / 1000) <= 300)) {
            setLoading(false);
            errAlt("This Pdf Is Large");
            return;
        } else if (file.type !== "application/pdf") {
            setLoading(false);
            errAlt("Only Pdf Files Accepted");
            return;
        }
        try {
            let pdfRef = ref(storage, `users/${auth.currentUser.uid}/cv.pdf`);
            await uploadBytes(pdfRef, file)
            .then(snapshot => {
                getDownloadURL(snapshot.ref)
                .then(url => {
                    let theDoc = doc(db, "users", auth.currentUser.uid);
                    updateDoc(theDoc, {
                        cv: url
                    })
                    setUserInfo({
                        isVerified: true,
                        user: {
                            ...userInfo,
                            cv: url
                        }
                    })
                })
            })
            setLoading(false);
        } catch (err) {
            setLoading(false);
            errhandling(err.code);
        }
    }

    const DeletePdf  = async () => {
        if (!checkIfApply()) {
            infoAlt("You Must Withdraw First");
            return;
        }
        setLoading(true);
        if (!userInfo.cv) {
            setLoading(false);
            errAlt("You Don't Have Cv");
            return;
        }
        try {
            let cvRef = ref(storage, `users/${auth.currentUser.uid}/cv.pdf`);
            await deleteObject(cvRef);
            let theDoc = doc(db, "users", auth.currentUser.uid);
            await updateDoc(theDoc, {
                cv: deleteField()
            });
            setUserInfo({
                isVerified: true,
                user: {
                    ...userInfo,
                    cv: undefined
                }
            });
            setPdffile();
            setLoading(false);
        } catch(err) {
            setLoading(false);
            errhandling(err.code);
        }
    }

    const saveInfo   = async (e) => {
        e.preventDefault();
        if (!checkIfApply()) {
            infoAlt("You Must Withdraw First");
            return;
        }
        setLoading(true);
        try {  
            let theDoc = doc(db, "users", auth.currentUser.uid);
            await updateDoc(theDoc, {
                fullname,
                place,
                birth,
                phonenumber,
                secondaryInfo,
                workExp,
                education,
                medicalInfo,
                isOld: isOld
            });
            setUserInfo({
                isVerified: true,
                user: {
                    ...userInfo,
                    fullname,
                    place,
                    birth,
                    phonenumber,
                    secondaryInfo,
                    workExp,
                    education,
                    medicalInfo,
                    isOld: isOld
                }
            });
            setLoading(false);
            succAlt("Saved Successfully");
        } catch(err) {
            setLoading(false);
            errhandling(err.code);
        }
    }
    return (
        <>
            <Navbar />
            <main id='profile-section'>
                <div className="container">
                    <h2 className='title'>My <span>Profile</span></h2>
                    <div className="profile-photo">
                        <div className="bg-secondary-soft px-4 py-5 rounded">
                                <h4 className="mb-5 mt-0 title">Upload your profile photo</h4>
                                <div className="text-center">
                                    <div className="square position-relative display-2 mb-3">
                                        {/* eslint-disable jsx-a11y/img-redundant-alt */}
                                        {!userInfo.profileImg && <i className="fas fa-fw fa-user position-absolute text-secondary"></i> }
                                        {userInfo.profileImg && <img src={userInfo.profileImg} alt="profile image" className={"profileImage"}/>}
                                    </div>
                                        <input type={"file"} id="uploadImage" name='uploadImage' hidden onChange={e => setImagefile(e.target.files[0])}/>
                                        <label htmlFor='uploadImage' className='btn mr-1'>Upload</label>
                                        <input type={"submit"} id="deleteImage" name='deleteImage' hidden onClick={DeleteImage} />
                                        <label htmlFor='deleteImage' className='btn ml-1'>Delete</label>
                                        <p className='text-muted mt-3 mb-0 text-capitalize'>Note: Image must be less or equal than 300kb</p>
                                </div>
                        </div>
                    </div>

                    <div className='profile-cv my-5'>
                        <div className="bg-secondary-soft px-4 py-5 rounded">
                                <h4 className="mb-5 mt-0 title">Upload your Cv</h4>
                                <div className="text-center">
                                    <div className="square position-relative display-2 mb-3">
                                            {!userInfo.cv && <i className="fa-solid fa-file text-secondary"></i>}
                                            {userInfo.cv && 
                                            <>
                                                <i className="fa-solid fa-file-circle-check text-secondary"></i>
                                                <a href={userInfo.cv} className='btn btn-info' target={'_blank'} rel="noreferrer">My Cv</a>
                                            </>}
                                    </div>
                                        <input type={"file"} id="uploadPdf" name='uploadPdf' hidden onChange={e => setPdffile(e.target.files[0])}/>
                                        <label htmlFor='uploadPdf' className='btn mr-1'>Upload</label>
                                        <input type={"submit"} id="deletePdf" name='deletePdf' hidden onClick={DeletePdf}/>
                                        <label htmlFor='deletePdf' className='btn ml-1'>Delete</label>
                                        <p className='text-muted mt-3 mb-0 text-capitalize'>Note: Pdf must be less or equal than 300kb</p>
                                </div>
                        </div>
                    </div>

                    <div className="account-details">
                        <div className="bg-secondary-soft px-4 py-5 rounded">
                            <h4 className='mb-5 mt-0 title'>Enter Your informations</h4>
                            <form autoComplete='off' onSubmit={saveInfo}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="firstname">FirstName<span>*</span></label>
                                            <input type={"text"} 
                                            className="form-control" 
                                            id='firstname'
                                            value={fullname.firstname}
                                            onChange={e => setFullname({...fullname, firstname: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="lastname">LastName<span>*</span></label>
                                            <input type={"text"} 
                                            className="form-control" 
                                            id='lastname'
                                            value={fullname.lastname}
                                            onChange={e => setFullname({...fullname, lastname: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="address">Address<span>*</span></label>
                                            <input type={"text"} 
                                            className="form-control" 
                                            id='address' 
                                            value={place.address}
                                            onChange={e => setPlace({...place, address: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="housenumber">House Number<span>*</span></label>
                                            <input type={"number"} 
                                            className="form-control" 
                                            id='housenumber' 
                                            value={place.housenumber}
                                            onChange={e => setPlace({...place, housenumber: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="postalcode">Postal Code<span>*</span></label>
                                            <input type={"text"} 
                                            className="form-control" 
                                            id='postalcode' 
                                            value={place.postalcode}
                                            onChange={e => setPlace({...place, postalcode: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>    
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='dateofbirthday'>Date Of Birthday<span>*</span></label>
                                            <input type={"date"} 
                                            className="form-control" 
                                            id='dateofbirthday' 
                                            value={birth.date}
                                            onChange={e => setBirth({...birth, date: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='countryofbirth'>Country Of Birth<span>*</span></label>
                                            <input type={"text"} 
                                            className="form-control" 
                                            id='countryofbirth' 
                                            value={birth.place}
                                            onChange={e => setBirth({...birth, place: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='city'>City<span>*</span></label>
                                            <input type={"text"} 
                                            className="form-control" 
                                            id='city' 
                                            value={place.city}
                                            onChange={e => setPlace({...place, city: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>      
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="phonenumber">Phone Number<span>*</span></label>
                                            <input type={"tel"} 
                                            className="form-control" 
                                            id='phonenumber' 
                                            value={phonenumber}
                                            onChange={e => setPhonenumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="secemail">Secondary Email</label>
                                            <input type={"email"} 
                                            className="form-control" 
                                            id='secemail' 
                                            value={secondaryInfo.secondaryemail}
                                            onChange={e => setSecondaryinfo({...secondaryInfo, secondaryemail: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>   
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="facebook">Facebook Link</label>
                                            <input type={"url"} 
                                            className="form-control" 
                                            id='facebook' 
                                            value={secondaryInfo.facebookLink}
                                            onChange={e => setSecondaryinfo({...secondaryInfo, facebookLink: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="linkedin">linkedin Link</label>
                                            <input type={"url"} 
                                            className="form-control" 
                                            id='linkedin' 
                                            value={secondaryInfo.linkedinLink}
                                            onChange={e => setSecondaryinfo({...secondaryInfo, linkedinLink: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>   
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="workexperience">Work Experience<span>*</span></label>
                                            <textarea 
                                            id='workexperience' 
                                            className='form-control' 
                                            rows={"7"}
                                            value={workExp}
                                            onChange={e => setWorkexp(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="education">Education<span>*</span></label>
                                            <textarea 
                                            id='education' 
                                            className='form-control' 
                                            rows={"7"}
                                            value={education}
                                            onChange={e => setEducation(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="medicalinfo">Medical Info<span>*</span></label>
                                            <textarea 
                                            id='medicalinfo' 
                                            className='form-control' 
                                            rows={"7"}
                                            value={medicalInfo}
                                            onChange={e => setMedicalinfo(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <label>have you ever worked in our company ?<span>*</span></label>
                                        <div className="custom-control custom-radio">
                                            <input type={"radio"} className="custom-control-input" name='questionOne' id='res1' onChange={() => setIsold(true)} checked={isOld}/>
                                            <label className='custom-control-label' htmlFor='res1'>Yes</label>
                                        </div>
                                        <div className="custom-control custom-radio">
                                            <input type={"radio"} className="custom-control-input" name='questionOne' id='res2' onChange={() => setIsold(false)} checked={!isOld}/>
                                            <label className='custom-control-label' htmlFor='res2'>No</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col">
                                            <button className='btn btn-success'>Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            {loading && <Loader />}
            <Footer />
        </>
    )
}

export default Profile