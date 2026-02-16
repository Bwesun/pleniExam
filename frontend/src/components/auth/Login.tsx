import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { login, user } = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    if (user) {
      const dashboardRoute = `/${user.role}/dashboard`;
      history.replace(dashboardRoute);
    }
  }, [user, history]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in all fields');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ username, password });
      // Navigation will be handled by useEffect
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <IonCard style={{ maxWidth: '500px', width: '100%' }}>
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">
                <h1>PleniExam</h1>
                <p>Login to your account</p>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonLabel position="stacked">Username or Email</IonLabel>
                  <IonInput
                    type="text"
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonButton 
                  expand="block" 
                  type="submit" 
                  className="ion-margin-top"
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="crescent" /> : 'Login'}
                </IonButton>

                <IonText className="ion-text-center ion-margin-top">
                  <p>
                    Don't have an account?{' '}
                    <a href="/register">Register here</a>
                  </p>
                </IonText>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={error}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
