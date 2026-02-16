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
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { documentTextOutline, trophyOutline, timeOutline } from 'ionicons/icons';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { examService } from '../../services/exam.service';
import { submissionService } from '../../services/submission.service';
import { Exam, Submission } from '../../types';

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [completedExams, setCompletedExams] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [examsResponse, resultsResponse] = await Promise.all([
        examService.getAllExams({ isActive: true }),
        submissionService.getMyResults(),
      ]);

      setAvailableExams(examsResponse.data || []);
      setCompletedExams(resultsResponse.data || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPassedExamsCount = () => {
    return completedExams.filter((submission) => {
      const exam = submission.exam as Exam;
      return submission.percentage >= exam.passingPercentage;
    }).length;
  };

  return (
    <IonPage id="main-content">
      <Sidebar />
      <Header title="Candidate Dashboard" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Welcome, {user?.firstName || user?.username}!
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>Ready to take your exams? Check out the available exams below.</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={documentTextOutline} size="large" color="primary" />
                  <h2>{availableExams.length}</h2>
                  <p>Available Exams</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={trophyOutline} size="large" color="success" />
                  <h2>{completedExams.length}</h2>
                  <p>Completed Exams</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={trophyOutline} size="large" color="warning" />
                  <h2>{getPassedExamsCount()}</h2>
                  <p>Passed Exams</p>
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
            <IonButton routerLink="/candidate/exams" expand="block">
              View Available Exams
            </IonButton>
            <IonButton routerLink="/candidate/results" expand="block" fill="outline">
              View My Results
            </IonButton>
          </IonCardContent>
        </IonCard>

        {completedExams.length > 0 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Recent Results</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {completedExams.slice(0, 5).map((submission) => {
                const exam = submission.exam as Exam;
                const passed = submission.percentage >= exam.passingPercentage;
                return (
                  <IonCard key={submission._id}>
                    <IonCardContent>
                      <h3>{exam.title}</h3>
                      <p>Score: {submission.totalScore}/{exam.totalMarks} ({submission.percentage.toFixed(2)}%)</p>
                      <p>Status: <strong style={{ color: passed ? 'green' : 'red' }}>
                        {passed ? 'PASSED' : 'FAILED'}
                      </strong></p>
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CandidateDashboard;
