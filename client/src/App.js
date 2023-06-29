import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login_register from './components/login-register/Login_register';
import AdminTable from './components/admin-table/AdminTable';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="login_register" element={<Login_register />} />
          <Route path="/" element={<AdminTable category={'draft'} />} />
          <Route path="admin_table" element={<AdminTable />} />
          <Route
            path="admin_table/drafts"
            element={<AdminTable category={'draft'} />}
          />
          <Route
            path="admin_table/products"
            element={<AdminTable category={'products'} />}
          />
          <Route
            path="admin_table/customers"
            element={<AdminTable category={'customers'} />}
          />
          <Route
            path="admin_table/transactions"
            element={<AdminTable category={'transactions'} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
