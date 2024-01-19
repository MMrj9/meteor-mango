import React from 'react';
import { Routes, Route } from "react-router-dom";
import Main from './ui/components/Main';
import CompanyForm from './ui/components/Company/CompanyForm';
import CompanyTable from './ui/components/Company/CompanyTable';
import RegistrationForm from './ui/components/Authentication/RegistrationForm';
import LoginForm from './ui/components/Authentication/LoginForm';

const routes = () => (
    <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/login" element={<LoginForm />}/>
        <Route path="/register" element={<RegistrationForm />}/>
        <Route path="company/*" element={<CompanyRoutes />} />
    </Routes> 
)

const CompanyRoutes = () => (
    <Routes>
      <Route path="add" element={<CompanyForm />} />
      <Route path="edit/:companyId" element={<CompanyForm />} />
      <Route path="" element={<CompanyTable />} />
    </Routes>
  );
  

export default routes