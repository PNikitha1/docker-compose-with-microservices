// import { Link } from "react-router-dom";
// import "./dashboard.css";

// function NavTile({ title, desc, to, color = "primary" }) {
//   return (
//     <Link to={to} className={`nav-tile ${color}`}>
//       <div className="nav-title">{title}</div>
//       <div className="nav-desc">{desc}</div>
//       <div className="nav-go">Go →</div>
//     </Link>
//   );
// }

// export default function Dashboard() {
//   return (
//     <div className="dashboard-page">
//       <header className="dash-header">
//         <div className="brand">
//           <span className="logo-dot" />
//           <span className="brand-name">PG Owner Portal</span>
//         </div>
//         <div className="header-actions">
//           <Link className="btn outline" to="/login">Login</Link>
//           <Link className="btn solid" to="/register">Register</Link>
//         </div>
//       </header>

//       <div className="page-title">
//         <h1>Dashboard</h1>
//         <p className="muted">Quickly navigate to manage rooms, tenants, notices, and maintenance tickets.</p>
//       </div>

//       {/* Navigation tiles */}
//       <section className="grid grid-4">
//         <NavTile
//           title="Rooms"
//           desc="View availability, capacity, pricing, and allocate rooms."
//           to="/rooms"
//           color="blue"
//         />
//         <NavTile
//           title="Tenants"
//           desc="Onboard tenants, view details, and track dues."
//           to="/tenants"
//           color="green"
//         />
//         <NavTile
//           title="Notices"
//           desc="Create and manage announcements for all residents."
//           to="/notices"
//           color="primary"
//         />
//         <NavTile
//           title="Raise Ticket"
//           desc="Log maintenance issues and track resolutions."
//           to="/tickets/raise"
//           color="red"
//         />
//       </section>

//       {/* You can keep some highlights or KPIs below if you want */}
//       <section className="panel">
        
// <div className="panel">
//           <div className="panel-head">
//             <h2>Quick Actions</h2>
//           </div>
//           <div className="actions-grid">
//             <button className="btn solid">Record Payment</button>
//             <button className="btn solid">Add Booking</button>
//             <button className="btn solid">Room Allocation</button>
//             <button className="btn solid">Generate Report</button>
//           </div>
        
//   <p className="muted" style={{ marginTop: 8 }}>
//             These actions are placeholders for now—wire them to forms or routes when your backend is ready.
//           </p>
//         </div>

//       </section>

//       <footer className="dash-footer">
//         <span>© {new Date().getFullYear()} PG Owner Portal • Vijayawada</span>
//         <span>Manage rooms, tenants, notices & maintenance</span>
//       </footer>
//     </div>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  logoutUser,
  selectToken,
  selectUserState,
} from "../../store/auth/authSlice";
import "./dashboard.css";

function NavTile({ title, desc, to, color = "primary" }) {
  return (
    <Link to={to} className={`nav-tile ${color}`}>
      <div className="nav-title">{title}</div>
      <div className="nav-desc">{desc}</div>
      <div className="nav-go">Go →</div>
    </Link>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { currentUser } = useSelector(selectUserState); // optional, if you store user info

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // After logout, you can redirect to login or stay on dashboard
      navigate("/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <div className="brand">
          <span className="logo-dot" />
          <span className="brand-name">PG Owner Portal</span>
        </div>

        <div className="header-actions">
          {!isAuthenticated ? (
            <>
              <Link className="btn outline" to="/login">
                Login
              </Link>
              <Link className="btn solid" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Optional: show a small greeting if you have currentUser */}
              {currentUser?.name ? (
                <span className="greet muted">Hi, {currentUser.name}</span>
              ) : null}

              <button className="btn solid" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      <div className="page-title">
        <h1>Dashboard</h1>
        <p className="muted">
          Quickly navigate to manage rooms, tenants, notices, and maintenance tickets.
        </p>
      </div>

      {/* Navigation tiles */}
      <section className="grid grid-4">
        <NavTile
          title="Rooms"
          desc="View availability, capacity, pricing, and allocate rooms."
          to="/rooms"
          color="blue"
        />
        <NavTile
          title="Tenants"
          desc="Onboard tenants, view details, and track dues."
          to="/tenants"
          color="green"
        />
        <NavTile
          title="Notices"
          desc="Create and manage announcements for all residents."
          to="/notices"
          color="primary"
        />
        <NavTile
          title="Raise Ticket"
          desc="Log maintenance issues and track resolutions."
          to="/tickets/raise"
          color="red"
        />
      </section>

      {/* Quick actions */}
      <section className="panel">
        <div className="panel">
          <div className="panel-head">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="btn solid">Record Payment</button>
            <button className="btn solid">Add Booking</button>
            <button className="btn solid">Room Allocation</button>
            <button className="btn solid">Generate Report</button>
          </div>

          <p className="muted" style={{ marginTop: 8 }}>
            These actions are placeholders for now—wire them to forms or routes when your backend is ready.
          </p>
        </div>
      </section>

      <footer className="dash-footer">
        <span>© {new Date().getFullYear()} PG Owner Portal • Vijayawada</span>
        <span>Manage rooms, tenants, notices &amp; maintenance</span>
      </footer>
    </div>
  );
}
