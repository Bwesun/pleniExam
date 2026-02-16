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
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'candidate' as 'candidate' | 'instructor' | 'admin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { register, user } = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    if (user) {
      const dashboardRoute = `/${user.role}/dashboard`;
      history.replace(dashboardRoute);
    }
  }, [user, history]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setShowToast(true);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      // Navigation will be handled by useEffect
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
                <p>Create your account</p>
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <form onSubmit={handleRegister}>
                <IonItem>
                  <IonLabel position="stacked">Username *</IonLabel>
                  <IonInput
                    type="text"
                    value={formData.username}
                    onIonChange={(e) => handleInputChange('username', e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Email *</IonLabel>
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonChange={(e) => handleInputChange('email', e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">First Name</IonLabel>
                  <IonInput
                    type="text"
                    value={formData.firstName}
                    onIonChange={(e) => handleInputChange('firstName', e.detail.value!)}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Last Name</IonLabel>
                  <IonInput
                    type="text"
                    value={formData.lastName}
                    onIonChange={(e) => handleInputChange('lastName', e.detail.value!)}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Role</IonLabel>
                  <IonSelect
                    value={formData.role}
                    onIonChange={(e) => handleInputChange('role', e.detail.value)}
                  >
                    <IonSelectOption value="candidate">Candidate</IonSelectOption>
                    <IonSelectOption value="instructor">Instructor</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Password *</IonLabel>
                  <IonInput
                    type="password"
                    value={formData.password}
                    onIonChange={(e) => handleInputChange('password', e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Confirm Password *</IonLabel>
                  <IonInput
                    type="password"
                    value={formData.confirmPassword}
                    onIonChange={(e) => handleInputChange('confirmPassword', e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonButton 
                  expand="block" 
                  type="submit" 
                  className="ion-margin-top"
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="crescent" /> : 'Register'}
                </IonButton>

                <IonText className="ion-text-center ion-margin-top">
                  <p>
                    Already have an account?{' '}
                    <a href="/login">Login here</a>
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

export default Register;
