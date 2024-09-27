import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './context/AuthProvider';
import { ProfileProvider } from './context/ProfileProvider';
import { QueryClient, QueryClientProvider } from 'react-query';


const root = ReactDOM.createRoot(document.getElementById('root'));
// Create a new instance of QueryClient
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    {/* every children component inside App will have access to states in AuthProvider*/}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
    {/* <App /> */}

  </React.StrictMode>
);

