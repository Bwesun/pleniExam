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
import { addCircleOutline, documentTextOutline, peopleOutline } from 'ionicons/icons';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { examService } from '../../services/exam.service';
import { Exam } from '../../types';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myExams, setMyExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyExams();
  }, []);

  const loadMyExams = async () => {
    try {
      const response = await examService.getAllExams();
      setMyExams(response.data || []);
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage id="main-content">
      <Sidebar />
      <Header title="Instructor Dashboard" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Welcome, {user?.firstName || user?.username}!
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Manage your exams and grade student submissions.</p>
          </IonCardContent>
        </IonCard>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={documentTextOutline} size="large" color="primary" />
                  <h2>{myExams.length}</h2>
                  <p>My Exams</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={addCircleOutline} size="large" color="success" />
                  <h2>Create</h2>
                  <p>New Exam</p>
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
            <IonButton routerLink="/instructor/create-exam" expand="block">
              <IonIcon icon={addCircleOutline} slot="start" />
              Create New Exam
            </IonButton>
            <IonButton routerLink="/instructor/exams" expand="block" fill="outline">
              <IonIcon icon={documentTextOutline} slot="start" />
              View My Exams
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default InstructorDashboard;
