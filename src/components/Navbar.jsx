import React, { useState } from 'react'
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../config/config';
import { useAuthe } from '../global/Authe';
import Loader from './Loader';

function Navbar() {
    const [loading, setLoading] = useState(false);
    const AuthInfo = useAuthe().userInfo;
    const userConnect = AuthInfo.isVerified;
    const navigate = useNavigate();
    const gender      = AuthInfo.user ? AuthInfo.user.gender: null;
    const closeMenu = () => {
        const navBar = document.querySelector("header nav");
        const burger = document.querySelector(".burger");
        navBar.classList.remove("active");
        burger.classList.remove("active");
    }
    const showMenu = () => {
        const navBar = document.querySelector("header nav");
        const burger = document.querySelector(".burger");
        navBar.classList.toggle("active");
        burger.classList.toggle("active");
    }
    const SignOut = async () => {
        setLoading(true);
        await signOut(auth);
        window.localStorage.clear();
        navigate("/");
        setLoading(false);
    }
return (
    <>
        <header className="fixed-top">
            <div className="container d-flex align-items-center justify-content-between">
                <div className='logo'>
                    <img src='/assets/logo.png' alt='logo' className='img-fluid' />
                </div>
                <div className='d-flex align-items-center justify-content-between'>
                    {userConnect && <Link to={'/Profile'} className="mr-2 d-none profile-link">
                            {!AuthInfo.user.profileImg && <img src={`/assets/profileImage/profile-${gender}.png`} alt='profile-img' className='img-fluid'/>}
                            {AuthInfo.user.profileImg && <img src={AuthInfo.user.profileImg} alt='profile-img' className='img-fluid'/>}
                    </Link>}
                    <div className='burger' onClick={showMenu}>
                        <span className='line1'></span>
                        <span className='line2'></span>
                        <span className='line3'></span>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li className='list-unstyled' onClick={closeMenu}><Link to={'/'}><i className="fa-solid fa-house mr-1 d-none h-icon"></i>Home</Link></li>
                        <li className='list-unstyled' onClick={closeMenu}><Link to={'/News'}><i className="fa-solid fa-newspaper mr-1 d-none h-icon"></i>News</Link></li>
                        {userConnect && <li className='list-unstyled' onClick={closeMenu}><Link to={'/Apply'}><i className="fa-solid fa-briefcase mr-1 d-none h-icon"></i>Apply</Link></li>}
                        {userConnect && <li className='list-unstyled' onClick={closeMenu}><Link to={'/Inbox'}><i className="fa-solid fa-inbox mr-1 d-none h-icon"></i>Inbox</Link></li>}
                        {!userConnect && <li className='list-unstyled' onClick={closeMenu}><Link to={'/Signin'}><i className="fa-solid fa-user mr-1"></i>Sign in</Link></li> }
                        {!userConnect && <li className='list-unstyled text-uppercase register mr-0' onClick={closeMenu}><Link to={'/Register'}><i className="fa-solid fa-user-plus mr-1 d-none h-icon"></i>Register</Link></li> }
                        {userConnect && <li className='list-unstyled profile' onClick={closeMenu}>
                            <Link to={'/Profile'}>
                                    {!AuthInfo.user.profileImg && <img src={`/assets/profileImage/profile-${gender}.png`} alt='profile-img' className='img-fluid'/>}
                                    {AuthInfo.user.profileImg && <img src={AuthInfo.user.profileImg} alt='profile-img' className='img-fluid'/>}
                            </Link>
                        </li>}
                        {userConnect && <li className='list-unstyled signout mr-0' onClick={closeMenu}><button className='text-uppercase' onClick={SignOut}><i className="fa-solid fa-right-from-bracket mr-1 d-none h-icon"></i>Sign out</button></li>}
                    </ul>
                </nav>
            </div>
        </header>
        {loading && <Loader /> }
    </>
    )
}

export default Navbar;