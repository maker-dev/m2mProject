import React from 'react'
import { Outlet } from 'react-router-dom';
import { useAuthe } from '../global/Authe'
import Admin from '../pages/admin/Admin';

function AdminProtectedRoutes() {
    const Authe = useAuthe().adminInfo;
    return Authe.isAuth ? <Outlet /> : <Admin />
}

export default AdminProtectedRoutes;