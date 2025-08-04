import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StoreOwnerDashboard from "./pages/StoreOwner/StoreOwnerDashboard";

// Route Guard
import PrivateRoute from "./routes/PrivateRoute";
import AddStore from "./pages/Admin/AddStore";
import AddUser from "./pages/Admin/AddUser";
import StoreList from "./pages/User/StoreList";
import UpdatePassword from "./pages/User/UpdatePassword";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-store" element={<AddStore />} />
          <Route path="/add-user" element={<AddUser />} />
        </Route>

        {/* Store Owner Routes */}
        <Route element={<PrivateRoute allowedRoles={["owner"]} />}>
          <Route
            path="/storeowner-dashboard"
            element={<StoreOwnerDashboard />}
          />
        </Route>

        {/* Normal User Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user-dashboard" element={<StoreList />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
