/* eslint-disable jsx-a11y/anchor-is-valid */
import { signOut } from 'firebase/auth';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader';
import { auth, usersColl } from '../../config/config';
import { useAuthe } from '../../global/Authe';

function Accepted() {
    const [loading, setLoading] = useState(false);
    const [acceptedList, setAcceptedlist] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        let getAccepted = query(usersColl, where("apply.state", "==", "accepted"), orderBy("createdAt", "desc"))
        getDocs(getAccepted)
        .then(res => {
            let acceptedUsers = [];
            res.docs.forEach(doc => {
                acceptedUsers.push({id: doc.id, ...doc.data()});
            })
            setAcceptedlist(acceptedUsers);
        })
    }, [])
    const adminInfo = useAuthe().adminInfo.admin;
    const toggleMenu = () => {
        var element = document.getElementById("wrapper");
        element.classList.toggle("toggled");
    }
    const signout = async () => {
        setLoading(true);
        await signOut(auth);
        window.localStorage.clear();
        navigate("/");
        setLoading(false);
    }
    return (
        <>
            <main id='dashboard-accepted'>
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
                            <div className="row mt-2">
                                <div className="col-12">
                                    <h3 className='fs-3 mb-3 text-muted text-capitalize'>Accepted User</h3>
                                    <div className="table-responsive">
                                        <table className="table bg-white rounded shadow-sm">
                                        <thead>
                                            <tr className='bg-success text-white'>
                                                <th scope="col">createdAt</th>
                                                <th scope="col">Firstname</th>
                                                <th scope="col">Lastname</th>
                                                <th scope='col'>Job</th>
                                                <th scope="col">View</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                acceptedList.map(accepted => {
                                                    return (
                                                        <tr key={accepted.id}>
                                                            <td className='va-center'>{accepted.createdAt.toDate().toLocaleDateString()}</td>
                                                            <td className='text-capitalize va-center text-nowrap'>{accepted.fullname.firstname}</td>
                                                            <td className='text-capitalize va-center text-nowrap'>{accepted.fullname.lastname}</td>
                                                            <td className='text-capitalize va-center text-nowrap'>{accepted.apply.job}</td>
                                                            <td>
                                                                <Link to={`/Admin/User/View/id/${accepted.id}`} className="btn btn-primary">
                                                                    <i className="fa-solid fa-magnifying-glass"></i>
                                                                </Link>
                                                            </td>
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

export default Accepted