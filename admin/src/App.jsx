import React, { useContext } from 'react';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// ✅ Import pages
import Dashboard from './pages/Admin/Dashboard';
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';

// ✅ Router
import { Routes, Route } from 'react-router-dom';

// ✅ Toast
import { Toaster } from 'react-hot-toast';

// ✅ Context
import { AdminContext } from './context/AdminContext';

const App = () => {

  const { aToken } = useContext(AdminContext);

  return (
    <>
      {/* ✅ Only ONE Toaster needed */}
      <Toaster position="top-right" reverseOrder={false} />

      {aToken ? (
        <div className='bg-[#F8F9FD] min-h-screen'>
          <Navbar />

          <div className='flex items-start'>
            <Sidebar />

            <div className='flex-1 p-4'>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/admin-dashboard' element={<Dashboard />} />
                <Route path='/all-appointments' element={<AllApointments />} />
                <Route path='/add-doctor' element={<AddDoctor />} />
                <Route path='/doctors-list' element={<DoctorsList />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;