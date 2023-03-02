import React from 'react'
import { Outlet } from 'react-router-dom';
import { useAuthe } from '../global/Authe'
import Signin from '../pages/Signin';

function UserProtectedRoutes() {
    const Authe = useAuthe().userInfo;
    return Authe.isVerified ? <Outlet /> : <Signin />
}

export default UserProtectedRoutes;