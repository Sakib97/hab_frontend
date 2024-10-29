import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav_bar from './components/Nav_bar';
import Home from './pages/home/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import AuthLayout from './pages/auth/AuthLayout';
import Profile from './pages/profile/Profile';
import Sadmin from './pages/dashboard/Sadmin';
import Editor from './pages/dashboard/editor/Editor';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './pages/auth/RequireAuth';
import RequireNoAuth from './pages/auth/RequireNoAuth';
import ProfileAccount from './pages/profile/ProfileAccount';
import ProfileWrite from './pages/profile/ProfileWrite';
import ForgetPassMail from './pages/auth/ForgetPassMail';
import ForgetPassResetPass from './pages/auth/ForgetPassResetPass';
import EditorArticleReview from './pages/dashboard/editor/EditorArticleReview';
import EditorUnrevArticles from './pages/dashboard/editor/EditorUnrevArticles';
import EditorReviewHistory from './pages/dashboard/editor/EditorReviewHistory';
import EditorArticleDetailsForRev from './pages/dashboard/editor/EditorArticleDetailsForRev';
import EditorNotifications from './pages/dashboard/editor/EditorNotifications';
import ProfileNotification from './pages/profile/ProfileNotification';

function App() {

  const ROLES = {
    'Sadmin': 1453,
    'Author': 1203,
    'Editor': 1260,
    'SubEditor': 1444,
    'GeneralUser': 2024
  }

  return (
    <Router>
      <div className="App">
        <div className="AppNavbar">
          <Nav_bar></Nav_bar>
        </div>

        <div style={{paddingTop: "62px"}} className="content">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>


            <Route element={<RequireNoAuth />}>
              <Route path="/auth" element={<AuthLayout />}>
                {/* Index route - default content for /auth */}
                <Route index element={<Navigate to="login" />} />  {/* Redirects to login by default */}
                <Route path="register" element={<Register />}></Route>
                <Route path="login" element={<Login />}></Route>
                <Route path="forget_pass_mail" element={<ForgetPassMail />}></Route>
                <Route path='reset_pass_token' element={<ForgetPassResetPass />}></Route>
              </Route>
            </Route>


            {/* profile page will require authentication */}
            <Route element={<RequireAuth allowedRoles={[ROLES.GeneralUser]} />}>
              <Route path="/profile" element={<Profile />} >
                <Route index element={<Navigate to="account" />} />
                <Route path='account' element={<ProfileAccount />}></Route>
              </Route>
            </Route>

            {/* <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}> */}
            <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
              <Route path="/profile" element={<Profile />} >
                <Route path='write' element={<ProfileWrite />}></Route> 
                <Route path='notification' element={<ProfileNotification />}></Route> 
                
              </Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
              <Route path="/editor_dashboard" element={<Editor />} >
                <Route path='review' element={<EditorArticleReview />}>
                  <Route path='unreviwed-articles' element={<EditorUnrevArticles />}></Route>
                  <Route path='review-history' element={<EditorReviewHistory />}></Route>
                  <Route path='article-review' element={<EditorArticleDetailsForRev />}></Route>
                </Route>
                <Route path='notification' element={<EditorNotifications />}></Route> 
                
              </Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Sadmin]} />}>
              <Route path="/sadmin_dashboard" element={<Sadmin />} />
            </Route>


            <Route path="/unauthorized" element={<Unauthorized />} />



            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
