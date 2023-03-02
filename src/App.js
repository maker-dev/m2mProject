import './App.scss';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News';
import Inbox from './pages/Inbox';
import Register from './pages/Register';
import Signin from './pages/Signin';
import Profile from './pages/Profile';
import Apply from './pages/Apply';
import Arrow from './components/Arrow';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import Verify from './pages/Verify';
import ResetPassword from './pages/ResetPassword';
import Authe from './global/Authe';
import Admin from './pages/admin/Admin';
import Dashboard from './pages/admin/Dashboard';
import UserProtectedRoutes from './protected/UserProtectedRoutes';
import AdminProtectedRoutes from './protected/AdminProtectedRoutes';
function App() {
  return (
    <div className="App">   
      <Authe>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/News' element={<News />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/Signin' element={<Signin />} />
            <Route path='/Verify' element={<Verify />} />
            <Route path='/ResetPassword' element={<ResetPassword />} />
            <Route element={<UserProtectedRoutes />}>
              <Route path='/Profile' element={<Profile />} />
              <Route path='/Apply' element={<Apply />} />
              <Route path='/Inbox' element={<Inbox />} />
            </Route>
            <Route path='/Admin' element={<Admin />} />
            <Route element={<AdminProtectedRoutes />}>
              <Route path='/Admin/Dashboard' element={<Dashboard />} />
            </Route>
            <Route path='*' element={<NotFound />} />
        </Routes>
        <Arrow />
        <ToastContainer />
      </Authe>
    </div>
  );
}

export default App;
