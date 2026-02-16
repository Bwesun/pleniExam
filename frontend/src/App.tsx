import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Candidate components
import CandidateDashboard from './components/candidate/CandidateDashboard';
import ExamList from './components/candidate/ExamList';
import ExamResults from './components/candidate/ExamResults';

// Instructor components
import InstructorDashboard from './components/instructor/InstructorDashboard';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            {/* Public routes */}
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />

            {/* Candidate routes */}
            <Route exact path="/candidate/dashboard">
              <PrivateRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </PrivateRoute>
            </Route>
            <Route exact path="/candidate/exams">
              <PrivateRoute allowedRoles={['candidate']}>
                <ExamList />
              </PrivateRoute>
            </Route>
            <Route exact path="/candidate/results">
              <PrivateRoute allowedRoles={['candidate']}>
                <ExamResults />
              </PrivateRoute>
            </Route>

            {/* Instructor routes */}
            <Route exact path="/instructor/dashboard">
              <PrivateRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </PrivateRoute>
            </Route>

            {/* Admin routes */}
            <Route exact path="/admin/dashboard">
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            </Route>
            <Route exact path="/admin/users">
              <PrivateRoute allowedRoles={['admin']}>
                <UserManagement />
              </PrivateRoute>
            </Route>

            {/* Default redirect */}
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
