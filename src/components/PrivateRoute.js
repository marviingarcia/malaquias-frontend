// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // Se o token estiver presente, renderize o Outlet (que renderiza as rotas privadas)
  // Caso contrário, redirecione para o login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
