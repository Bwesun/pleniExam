import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { peopleOutline, documentTextOutline, settingsOutline } from 'ionicons/icons';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';
import { examService } from '../../services/exam.service';
import { User, Exam } from '../../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersResponse, examsResponse] = await Promise.all([
        userService.getAllUsers(),
        examService.getAllExams(),
      ]);

      setUsers(usersResponse.data || []);
      setExams(examsResponse.data || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsersByRole = (role: string) => {
    return users.filter((u) => u.role === role).length;
  };

  return (
    <IonPage id="main-content">
      <Sidebar />
      <Header title="Admin Dashboard" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Welcome, Administrator {user?.firstName || user?.username}!
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Manage users, exams, and system settings.</p>
          </IonCardContent>
        </IonCard>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="3">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={peopleOutline} size="large" color="primary" />
                  <h2>{users.length}</h2>
                  <p>Total Users</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="3">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={peopleOutline} size="large" color="success" />
                  <h2>{getUsersByRole('candidate')}</h2>
                  <p>Candidates</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="3">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={peopleOutline} size="large" color="warning" />
                  <h2>{getUsersByRole('instructor')}</h2>
                  <p>Instructors</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="3">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={documentTextOutline} size="large" color="tertiary" />
                  <h2>{exams.length}</h2>
                  <p>Total Exams</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Quick Actions</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton routerLink="/admin/users" expand="block">
              <IonIcon icon={peopleOutline} slot="start" />
              Manage Users
            </IonButton>
            <IonButton routerLink="/admin/exams" expand="block" fill="outline">
              <IonIcon icon={documentTextOutline} slot="start" />
              Manage Exams
            </IonButton>
            <IonButton routerLink="/admin/settings" expand="block" fill="outline">
              <IonIcon icon={settingsOutline} slot="start" />
              System Settings
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
