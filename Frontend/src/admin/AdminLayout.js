import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';


const IconDashboard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconProducts = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.5 4.21"></path><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconLogout = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

const IconPaw = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{color:'#fd7e14'}}>
    <circle cx="4" cy="9" r="2.5" />
    <circle cx="9" cy="5" r="2.5" />
    <circle cx="15" cy="5" r="2.5" />
    <circle cx="20" cy="9" r="2.5" />
    <path d="M12 10C8 10 5 13 5 16C5 19.5 8 22 12 22C16 22 19 19.5 19 16C19 13 16 10 12 10Z" />
  </svg>
);

const AdminLayout = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path) ? 'active' : '';

  return (
    <div className="d-flex bg-light">
      
      {

      }
      <aside className="admin-sidebar">
        {

        }
        <div className="brand-section d-flex align-items-center gap-2 p-3 border-bottom">
          <IconPaw /> 
          <span className="fw-bold text-dark fs-4">PawSy Admin</span>
        </div>

        <nav className="nav-section mt-3">
          <Link to="/admin/dashboard" className={`sidebar-link ${isActive('dashboard')}`}>
            <span className="me-3"><IconDashboard /></span> Dashboard
          </Link>
          <Link to="/admin/products" className={`sidebar-link ${isActive('products')}`}>
            <span className="me-3"><IconProducts /></span> Manage Products
          </Link>
          <Link to="/admin/users" className={`sidebar-link ${isActive('users')}`}>
             <span className="me-3"><IconUsers /></span> Manage Users
          </Link>
        </nav>

        <div className="p-3 border-top mt-auto">
          <Link to="/" className="sidebar-link text-danger">
            <span className="me-3"><IconLogout /></span> Logout
          </Link>
        </div>
      </aside>

      {
        
      }
      <main className="main-content flex-grow-1">
        <header className="top-header">
          <h5 className="m-0 text-secondary">Admin Control Panel</h5>
          
          <div className="d-flex align-items-center gap-3">
             <div className="text-end lh-1">
                <div className="fw-bold text-dark">Admin User</div>
                <small className="text-muted" style={{fontSize: '0.8rem'}}>Administrator</small>
             </div>
             
             {

             }
             <div className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm" 
                  style={{
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#fd7e14',
                    fontSize: '1.2rem'
                  }}>
                A
             </div>
          </div>
        </header>

        <div className="page-container">
           <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;