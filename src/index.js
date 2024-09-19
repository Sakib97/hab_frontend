import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './context/AuthProvider';
import { ProfileProvider } from './context/ProfileProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* every children component inside App will have access to states in AuthProvider*/}
    <AuthProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </AuthProvider>

    {/* <App /> */}

  </React.StrictMode>
);

