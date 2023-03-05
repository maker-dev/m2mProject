/* eslint-disable jsx-a11y/anchor-is-valid */
import { signOut } from 'firebase/auth';
import { doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { auth, db, usersColl } from '../../config/config';
import { useAuthe } from '../../global/Authe';
import Swal from 'sweetalert2';
import { errhandling } from '../../utilities/ErrorHandling';
function Admission() {
    const [loading, setLoading] = useState(false);
    const [pendingList, setPendinglist] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        let getPending = query(usersColl, where("apply.state", "==", "pending"), orderBy("createdAt", "asc"))
        getDocs(getPending)
        .then(res => {
            let pendings = [];
            res.docs.forEach(doc => {
                pendings.push({id: doc.id, ...doc.data()});
            })
            setPendinglist(pendings);
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
        navigate("/")
        setLoading(false);
    }
    const AccepteUser = async (user) => {
        let response = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Accepte'
        }).then(res => res);
        if (!response.isConfirmed) {
            return;
        } else if (response.isConfirmed) {
            try {
                setLoading(true);
                let theDoc = doc(db, "users", user.id);
                await updateDoc(theDoc, {
                    inbox: [
                        ...user.inbox,
                        {
                            createdAt: `${new Date().toDateString()}`,
                            title: "Congratulations",
                            to: `${user.fullname.firstname}`,
                            msg: "We are delighted to inform you that your job application has been successful, and we are impressed with your qualifications and experience. Congratulations on your new role with our company! In the coming days, you will receive an email with further instructions on the onboarding process, including your start date and what to expect on your first day. If you have any questions or concerns, please don't hesitate to contact us.",
                            thanks: "Best Regards",
                            from: "m2mServices",
                        }
                    ],
                    apply: {
                        state: "accepted",
                        job: user.apply.job
                    }
                })
                setPendinglist(pendings => {
                    return pendings.filter(pending => pending.id !== user.id)
                })
                setLoading(false);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'User has been Accepted',
                    showConfirmButton: false,
                    timer: 1500
                })
            } catch(err) {
                setLoading(false);
                errhandling(err.code);
            }
        }
    }
    const RejectUser  = async (user) => {
        let response = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(res => res);
        if (!response.isConfirmed) {
            return;
        } else if (response.isConfirmed) {
            try {
                setLoading(true);
                let theDoc = doc(db, "users", user.id);
                await updateDoc(theDoc, {
                    inbox: [
                        ...user.inbox,
                        {
                            createdAt: `${new Date().toDateString()}`,
                            title: "Application Has Been Closed",
                            to: `${user.fullname.firstname}`,
                            msg: "Thank you for taking the time to apply for the position with our company. We appreciate your interest in working with us and appreciate the effort you put into your application. After careful consideration of your application and qualifications, we regret to inform you that we have decided not to move forward with your application.",
                            thanks: "Best Regards",
                            from: "m2mServices",
                        }
                    ],
                    apply: {
                        state: "rejected",
                        job: user.apply.job
                    }
                })
                setPendinglist(pendings => {
                    return pendings.filter(pending => pending.id !== user.id)
                })
                setLoading(false);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'User has been Rejected',
                    showConfirmButton: false,
                    timer: 1500
                })
            } catch(err) {
                setLoading(false);
                errhandling(err.code);
            }
        }
    }
    return (
        <>
            <main id='dashboard-admission'>
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
                                    <h3 className='fs-3 mb-3 text-muted text-capitalize'>Admission Table</h3>
                                    <div className="table-responsive">
                                        <table className="table bg-white rounded shadow-sm table-striped">
                                        <thead>
                                            <tr className='bg-info text-white'>
                                                <th scope="col">createdAt</th>
                                                <th scope="col">Firstname</th>
                                                <th scope="col">Lastname</th>
                                                <th scope='col'>Job</th>
                                                <th scope="col">View</th>
                                                <th scope='col'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pendingList.map(pending => {
                                                    return (
                                                        <tr key={pending.id}>
                                                            <td className='va-center'>{pending.createdAt.toDate().toLocaleDateString()}</td>
                                                            <td className='text-capitalize va-center text-nowrap'>{pending.fullname.firstname}</td>
                                                            <td className='text-capitalize va-center text-nowrap'>{pending.fullname.lastname}</td>
                                                            <td className='text-capitalize va-center text-nowrap'>{pending.apply.job}</td>
                                                            <td>
                                                                <Link to={`/Admin/User/View/id/${pending.id}`} className="btn btn-primary">
                                                                    <i className="fa-solid fa-magnifying-glass"></i>
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex'>
                                                                    <button className='btn btn-success' onClick={() => AccepteUser(pending)}>Accept</button>
                                                                    <span className='px-2'></span>
                                                                    <button className='btn btn-danger' onClick={() => RejectUser(pending)}>Reject</button>
                                                                </div>
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

export default Admission