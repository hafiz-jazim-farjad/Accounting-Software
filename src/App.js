import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Dashboard from './Pages/Dashboard/Dashboard';
import Vendor from './Pages/Vendor/Vendor';
import Customer from './Pages/Customer/Customer';
import Sale from './Pages/Sale/Sale';
import Purchase from './Pages/Purchase/Purchase';
import Product from './Pages/Product/Product';
import UOM from './Pages/UOM/UOM';
import Invoice from './Pages/Invoice/Invoice';
import Attendance from './Pages/Attendance/Attendance';
import Employee from './Pages/Employee/Employee';
import Salary from './Pages/Salary/Salary';
import SeeVenders from './Pages/SeeVenders/SeeVenders';
import SeeCustomers from './Pages/SeeCustomers/SeeCustomers';
import EditVenders from './Pages/EditVender/EditVender';
import EditCustomer from './Pages/EditCustomer/EditCustomer';
import SeeSales from './Pages/SeeSales/SeeSales';
import EditSales from './Pages/EditSales/EditSales';
import SeeProducts from './Pages/SeeProducts/SeeProducts';
import EditProduct from './Pages/EditProduct/EditProduct';
import SeePurchases from './Pages/SeePurchases/SeePurchases';
import EditPurchase from './Pages/EditPurchase/EditPurchase';
export function LoginComponent() {
  return window.location = "/Login"
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginComponent />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<Login />} />
     
      <Route path="/Dashboard" element={<Dashboard />} />

      <Route path="/Vendor" element={<Vendor />} />
      <Route path="/SeeVenders" element={<SeeVenders />} />
      <Route path="/EditVenders/id/:id" element={<EditVenders />} />

      <Route path="/Customer" element={<Customer />} />
      <Route path="/SeeCustomers" element={<SeeCustomers />} />
      <Route path="/EditCustomer/id/:id" element={<EditCustomer />} />

      <Route path="/Sale" element={<Sale />} />
      <Route path="/SeeSales" element={<SeeSales />} />
      <Route path="/EditSales/id/:id" element={<EditSales />} />

      <Route path="/Purchase" element={<Purchase />} />
      <Route path="/SeePurchases" element={<SeePurchases />} />
      <Route path="/EditPurchase/id/:id" element={<EditPurchase />} />

      <Route path="/Product" element={<Product />} />
      <Route path="/SeeProducts" element={<SeeProducts />} />
      <Route path="//EditProduct/id/:id" element={<EditProduct />} />

      <Route path="/Invoice" element={<Invoice />} />

      <Route path="/UOM" element={<UOM />} />
      <Route path="/Attendance" element={<Attendance />} />
      <Route path="/Employee" element={<Employee />} />
      <Route path="/Salary" element={<Salary />} />

    </Routes>
    // Testing for updating code
  );
}