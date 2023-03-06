/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {signOut} from 'firebase/auth';
import {auth, usersColl} from '../../config/config';
import Loader from '../../components/Loader';
import { getCountFromServer, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useAuthe } from '../../global/Authe';
function Dashboard() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    //job state
    const [accepted, setAccepted] = useState(0);
    const [rejected, setRejected] = useState(0);
    const [pending, setPending]   = useState(0);
    const [visitor, setVisitor]   = useState(0);
    //visitors
    const [visitorList, setVisitorlist] = useState([]);
    //jobs interests
    const [security, setSecurity] = useState(null);
    const [hostess, setHostess]   = useState(null);
    const [dogTrainer, setDogtrainer] = useState(null);
    const [unselected, setUnselected] = useState(null);
    const adminInfo = useAuthe().adminInfo.admin;
    useEffect(() => {
        //get state Numbers
        let getAccepted = query(usersColl, where("apply.state", "==", "accepted"));
        getCountFromServer(getAccepted)
        .then(res => {
            setAccepted(res.data().count);
        })
        let getRejected = query(usersColl, where("apply.state", "==", "rejected"));
        getCountFromServer(getRejected)
        .then(res => {
            setRejected(res.data().count);
        })
        let getPending = query(usersColl, where("apply.state", "==", "pending"));
        getCountFromServer(getPending)
        .then(res => {
            setPending(res.data().count);
        })
        let getVisitor = query(usersColl, where("apply.state", "==", "visitor"), orderBy("createdAt", "desc"), limit(10));
        getCountFromServer(getVisitor)
        .then(res => {
            setVisitor(res.data().count);
        })
        //get job interests
        getJobsProgress();
        //get visitors
        getDocs(getVisitor)
        .then(res => {
            let visitors = [];
            res.docs.forEach(doc => {
                visitors.push({id: doc.id, ...doc.data()})
            })
            setVisitorlist(visitors);
        })
        
    }, [])
    const getJobsProgress = async () => {
        let securities = null;
        let hostesses  = null;
        let dogTrainers = null;
        let unselected  = null;
        let getSecurity = query(usersColl, where("apply.job", "==", "security"));
        await getCountFromServer(getSecurity)
        .then(res => {
            securities = res.data().count
        })
        let getHostess  = query(usersColl, where("apply.job", "==", "hostess"));
        await getCountFromServer(getHostess)
        .then(res => {
            hostesses = res.data().count;
        })
        let getDogTrainer = query(usersColl, where("apply.job", "==", "dog trainer"));
        await getCountFromServer(getDogTrainer)
        .then(res => {
            dogTrainers = res.data().count;
        })
        let getUnselected = query(usersColl, where("apply.job", "==", ""))
        await getCountFromServer(getUnselected)
        .then(res => {
            unselected = res.data().count;
        })
        if (!securities && !hostesses && !dogTrainers && !unselected) {
            return;
        }
        setSecurity(((securities / (securities+hostesses+dogTrainers+unselected)) * 100).toFixed(1))
        setHostess(((hostesses / (securities+hostesses+dogTrainers+unselected)) * 100).toFixed(1))
        setDogtrainer(((dogTrainers / (securities+hostesses+dogTrainers+unselected)) * 100).toFixed(1))
        setUnselected(((unselected / (securities+hostesses+dogTrainers+unselected)) * 100).toFixed(1))
    }
    const toggleMenu = () => {
        var element = document.getElementById("wrapper");
        element.classList.toggle("toggled");
    }
    const signout = async () => {
        setLoading(true);
        await signOut(auth);
        window.localStorage.clear();
        navigate("/")
        setLoading(false);
    }
    return (
        <>
            <main id='dashboard-home'>
                <div className="d-flex primary-bg" id="wrapper" >
                <div className="bg-white" id="sidebar-wrapper">
                    <div className="sidebar-heading text-center ls-1 py-4 second-text fs-2 fw-bold text-uppercase border-bottom"><i
                            className="fas fa-user-secret mr-2"></i>Admin</div>
                    <div className="list-group list-group-flush my-3">
                        <Link to={"/Admin/Dashboard"} className=" text-info list-group-item list-group-item-action bg-transparent">
                            <i className="fas fa-tachometer-alt mr-2"></i>Dashboard</Link>
                        <Link to={"/Admin/Admission"} className=" text-primary list-group-item list-group-item-action bg-transparent">
                            <i className="fa-solid fa-clipboard mr-2"></i>Admission</Link>
                        <Link to={"/Admin/Accepted"} className=" text-success list-group-item list-group-item-action bg-transparent">
                            <i className="fa-solid fa-file-circle-check mr-2"></i>Accepted
                        </Link>
                        <Link to={"/Admin/Rejected"} className=" text-danger list-group-item list-group-item-action bg-transparent">
                            <i className="fa-solid fa-file-circle-xmark mr-2"></i>Rejected
                        </Link>
                        <a className="list-group-item list-group-item-action bg-transparent text-warning fw-bold" onClick={signout}>
                            <i className="fas fa-power-off mr-2"></i>Logout</a>
                    </div>
                </div>

                <div id="page-content-wrapper">
                    <nav className="navbar-light bg-transparent py-4 px-4 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-align-left primary-text fs-4 mr-3" id="menu-toggle" onClick={toggleMenu}></i>
                        </div>

                        <div className='fw-bold second-text text-capitalize'>
                            <i className="fas fa-user me-2 mr-2"></i>
                            {
                                `${adminInfo.fullname.firstname} ${adminInfo.fullname.lastname}`
                            }
                        </div>
                    </nav>

                    <div className="container-fluid px-4">
                        <div className="row mt-2 mb-5">
                            <div className="col-12">
                                <h3 className="fs-3 mb-3 text-muted text-capitalize">dashboard</h3>
                            </div>
                            <div className="col-12 col-md-6 col-xl-3 mb-3 mb-xl-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{accepted}</h3>
                                        <p className="fs-5 text-success text-uppercase">Accepted</p>
                                    </div>
                                    <i className="fa-solid fa-user-check fs-1 success-bg border rounded-full p-3 text-success "></i>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-3 mb-3 mb-xl-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{rejected}</h3>
                                        <p className="fs-5 text-danger text-uppercase">Rejected</p>
                                    </div>
                                        <i className="fa-solid fa-user-xmark fs-1 danger-bg text-danger border rounded-full p-3"></i>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-3 mb-3 mb-md-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{pending}</h3>
                                        <p className="fs-5 text-info text-uppercase">Pending</p>
                                    </div>
                                    <i className="fa-solid fa-user-clock fs-1 text-info border rounded-full info-bg p-3"></i>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-3 mb-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{visitor}</h3>
                                        <p className="fs-5 text-warning text-uppercase">Visitors</p>
                                    </div>
                                        <i className="fa-solid fa-user-tag fs-1 text-warning border rounded-full warning-bg p-3"></i>

                                </div>
                            </div>
                        </div>

                        <div className="row my-5">
                            <div className="col-12">
                                <h3 className='fs-3 mb-3 text-capitalize text-muted'>job interests</h3>
                                <div className="card shadow-sm">
                                    <div className="card-header py-3">
                                        <h6 className='m-0 font-weight-bold text-primary text-uppercase fs-5'>Jobs</h6>
                                    </div>
                                    <div className="card-body">
                                        {/*security*/}
                                        <h4 className="h6 font-weight-bold text-secondary">
                                            Security
                                            <span className='float-right'>
                                                {security && <>{security}</>}
                                                {security === null && <>0</>}
                                                %
                                            </span>
                                        </h4>
                                        <div className="progress mb-4">
                                            <div 
                                            className="progress-bar bg-danger"
                                            role={"progressbar"}
                                            style={{width: `${security || 0}%`}}   
                                            aria-valuenow={security || 0}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            >
                                            </div>
                                        </div>
                                        {/*hostess*/}
                                        <h4 className="h6 font-weight-bold text-secondary">
                                            Hostess
                                            <span className='float-right'>
                                                {hostess && <>{hostess}</>}
                                                {hostess === null && <>0</>}
                                                %
                                            </span>
                                        </h4>
                                        <div className="progress mb-4">
                                            <div 
                                            className="progress-bar bg-success"
                                            role={"progressbar"}
                                            style={{width: `${hostess || 0}%`}}   
                                            aria-valuenow={hostess || 0}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            >
                                            </div>
                                        </div>
                                        {/*dog trainer*/}
                                        <h4 className="h6 font-weight-bold text-secondary">
                                            Dog Trainer
                                            <span className='float-right'>
                                                {dogTrainer && <>{dogTrainer}</>}
                                                {dogTrainer === null && <>0</>}
                                                %
                                            </span>
                                        </h4>
                                        <div className="progress mb-4">
                                            <div 
                                            className="progress-bar bg-warning"
                                            role={"progressbar"}
                                            style={{width: `${dogTrainer || 0}%`}}   
                                            aria-valuenow={dogTrainer || 0}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            >
                                            </div>
                                        </div>
                                        {/*unselected*/}
                                        <h4 className="h6 font-weight-bold text-secondary">
                                            Unselected
                                            <span className='float-right'>
                                                {unselected && <>{unselected}</>}
                                                {unselected === null && <>0</>}
                                                %
                                            </span>
                                        </h4>
                                        <div className="progress">
                                            <div 
                                            className="progress-bar bg-info"
                                            role={"progressbar"}
                                            style={{width: `${unselected || 0}%`}}   
                                            aria-valuenow={unselected || 0}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row my-5">
                            <div className="col-12">
                                <h3 className="fs-3 mb-3 text-capitalize text-muted">Recent Visitors</h3>
                            </div>
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table bg-white rounded shadow-sm table-hover">
                                        <thead className='thead-dark'>
                                            <tr>
                                                <th scope="col">createdAt</th>
                                                <th scope="col">Firstname</th>
                                                <th scope="col">Lastname</th>
                                                <th scope="col">Gender</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                visitorList.map((visitor) => {
                                                    return (
                                                        <tr key={visitor.id}>
                                                            <td>{visitor.createdAt.toDate().toLocaleDateString()}</td>
                                                            <td>{visitor.fullname.firstname}</td>
                                                            <td>{visitor.fullname.lastname}</td>
                                                            <td>{visitor.gender}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            </main>
            {loading && <Loader />}
        </>
    )
}

export default Dashboard