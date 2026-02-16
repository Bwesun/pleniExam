import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { documentTextOutline, timeOutline } from 'ionicons/icons';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { examService } from '../../services/exam.service';
import { submissionService } from '../../services/submission.service';
import { Exam } from '../../types';

const ExamList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await examService.getAllExams({ isActive: true });
      setExams(response.data || []);
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchText.toLowerCase()) ||
    exam.subject?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage id="main-content">
      <Sidebar />
      <Header title="Available Exams" />
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          placeholder="Search exams..."
        />

        <IonList>
          {filteredExams.map((exam) => (
            <IonCard key={exam._id}>
              <IonCardHeader>
                <IonCardTitle>{exam.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{exam.description}</p>
                <IonLabel>
                  <IonIcon icon={documentTextOutline} /> Subject: {exam.subject || 'N/A'}
                </IonLabel>
                <br />
                <IonLabel>
                  <IonIcon icon={timeOutline} /> Duration: {exam.duration} minutes
                </IonLabel>
                <br />
                <IonLabel>
                  Total Marks: {exam.totalMarks} | Passing: {exam.passingPercentage}%
                </IonLabel>
                <IonButton
                  expand="block"
                  routerLink={`/candidate/exam/${exam._id}`}
                  className="ion-margin-top"
                >
                  Take Exam
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {filteredExams.length === 0 && !loading && (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <p>No exams available at the moment.</p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ExamList;
