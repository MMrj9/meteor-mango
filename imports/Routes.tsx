import React from 'react';
import { Routes, Route } from "react-router-dom";
import Main from './ui/components/Main';

const routes = () => (
    <Routes>
        <Route path="/" element={<Main />}/>
    </Routes> 
)

export default routes