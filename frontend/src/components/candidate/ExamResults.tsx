import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
} from '@ionic/react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { submissionService } from '../../services/submission.service';
import { Submission, Exam } from '../../types';

const ExamResults: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await submissionService.getMyResults();
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage id="main-content">
      <Sidebar />
      <Header title="My Results" />
      <IonContent className="ion-padding">
        {submissions.length === 0 && !loading && (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <p>No exam results yet. Take an exam to see your results here.</p>
            </IonCardContent>
          </IonCard>
        )}

        {submissions.map((submission) => {
          const exam = submission.exam as Exam;
          const passed = submission.percentage >= exam.passingPercentage;
          return (
            <IonCard key={submission._id}>
              <IonCardHeader>
                <IonCardTitle>{exam.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>Score:</IonLabel>
                    <IonBadge color={passed ? 'success' : 'danger'}>
                      {submission.totalScore}/{exam.totalMarks}
                    </IonBadge>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Percentage:</IonLabel>
                    <IonBadge color={passed ? 'success' : 'danger'}>
                      {submission.percentage.toFixed(2)}%
                    </IonBadge>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Status:</IonLabel>
                    <IonBadge color={passed ? 'success' : 'danger'}>
                      {passed ? 'PASSED' : 'FAILED'}
                    </IonBadge>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Grading Status:</IonLabel>
                    <IonBadge color={submission.status === 'graded' ? 'success' : 'warning'}>
                      {submission.status}
                    </IonBadge>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Submitted:</IonLabel>
                    <IonLabel>{new Date(submission.submittedAt!).toLocaleDateString()}</IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default ExamResults;
