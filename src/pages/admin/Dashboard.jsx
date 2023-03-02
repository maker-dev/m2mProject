/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {signOut} from 'firebase/auth';
import {auth, usersColl} from '../../config/config';
import Loader from '../../components/Loader';
import { getCountFromServer, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useAuthe } from '../../global/Authe';
function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(0);
    const [rejected, setRejected] = useState(0);
    const [pending, setPending]   = useState(0);
    const [visitor, setVisitor]   = useState(0);
    const [visitorList, setVisitorlist] = useState([]);
    const adminInfo = useAuthe().adminInfo.admin;
    useEffect(() => {
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
        getDocs(getVisitor)
        .then(res => {
            let visitors = [];
            res.docs.forEach(doc => {
                visitors.push({id: doc.id, ...doc.data()})
            })
            setVisitorlist(visitors);
        })
        
    }, [])
    const toggleMenu = () => {
        var element = document.getElementById("wrapper");
        element.classList.toggle("toggled");
    }
    const signout = async () => {
        setLoading(true);
        await signOut(auth);
        window.localStorage.clear();
        setLoading(false);
    }
    return (
        <>
            <main id='dashboard-home'>
                <div className="d-flex primary-bg" id="wrapper" >
                <div className="bg-white" id="sidebar-wrapper">
                    <div className="sidebar-heading text-center py-4 second-text fs-2 fw-bold text-uppercase border-bottom"><i
                            className="fas fa-user-secret mr-2"></i>Admin</div>
                    <div className="list-group list-group-flush my-3">
                        <Link to={"/Admin/Dashboard"} href="#" className="dashboard list-group-item list-group-item-action bg-transparent">
                            <i className="fas fa-tachometer-alt mr-2"></i>Dashboard</Link>
                        <a className="list-group-item list-group-item-action bg-transparent text-danger fw-bold" onClick={signout}>
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
                        <div className="row my-2">
                            <div className="col-12">
                                <h3 className="fs-4 mb-3 text-muted text-capitalize">dashboard</h3>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-lg-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{accepted}</h3>
                                        <p className="fs-5 text-success text-uppercase">Accepted</p>
                                    </div>
                                    <i className="fa-solid fa-user-check fs-1 secondary-bg border rounded-full p-3 text-success"></i>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-lg-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{rejected}</h3>
                                        <p className="fs-5 text-danger text-uppercase">Rejected</p>
                                    </div>
                                        <i className="fa-solid fa-user-xmark fs-1 text-danger border rounded-full secondary-bg p-3"></i>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{pending}</h3>
                                        <p className="fs-5 text-info text-uppercase">Pending</p>
                                    </div>
                                    <i className="fa-solid fa-user-clock fs-1 text-info border rounded-full secondary-bg p-3"></i>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-3 mb-md-0">
                                <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                    <div>
                                        <h3 className="fs-2">{visitor}</h3>
                                        <p className="fs-5 text-warning text-uppercase">Visitor</p>
                                    </div>
                                        <i className="fa-solid fa-user-tag fs-1 text-warning border rounded-full secondary-bg p-3"></i>

                                </div>
                            </div>
                        </div>

                        <div className="row my-5">
                            <div className="col-12">
                                <h3 className="fs-4 mb-3 text-capitalize text-muted">Recent Visitors</h3>
                            </div>
                            <div className="col-12">
                                <table className="table bg-white rounded shadow-sm  table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" width="50">#</th>
                                            <th scope="col">Firstname</th>
                                            <th scope="col">Lastname</th>
                                            <th scope="col">Gender</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            visitorList.map((visitor, index) => {
                                                return (
                                                    <tr key={visitor.id}>
                                                        <th scope="row">{index  + 1}</th>
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
            </main>
            {loading && <Loader />}
        </>
    )
}

export default Dashboard