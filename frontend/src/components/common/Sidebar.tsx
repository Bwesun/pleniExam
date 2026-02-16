import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import {
  homeOutline,
  documentTextOutline,
  peopleOutline,
  personOutline,
  addCircleOutline,
  statsChartOutline,
  settingsOutline,
} from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getCandidateMenuItems = () => [
    { title: 'Dashboard', url: '/candidate/dashboard', icon: homeOutline },
    { title: 'Available Exams', url: '/candidate/exams', icon: documentTextOutline },
    { title: 'My Results', url: '/candidate/results', icon: statsChartOutline },
    { title: 'Profile', url: '/candidate/profile', icon: personOutline },
  ];

  const getInstructorMenuItems = () => [
    { title: 'Dashboard', url: '/instructor/dashboard', icon: homeOutline },
    { title: 'Create Exam', url: '/instructor/create-exam', icon: addCircleOutline },
    { title: 'My Exams', url: '/instructor/exams', icon: documentTextOutline },
    { title: 'Grade Essays', url: '/instructor/grade', icon: statsChartOutline },
  ];

  const getAdminMenuItems = () => [
    { title: 'Dashboard', url: '/admin/dashboard', icon: homeOutline },
    { title: 'User Management', url: '/admin/users', icon: peopleOutline },
    { title: 'Exam Management', url: '/admin/exams', icon: documentTextOutline },
    { title: 'Settings', url: '/admin/settings', icon: settingsOutline },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'candidate':
        return getCandidateMenuItems();
      case 'instructor':
        return getInstructorMenuItems();
      case 'admin':
        return getAdminMenuItems();
      default:
        return [];
    }
  };

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PleniExam</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {getMenuItems().map((item, index) => (
            <IonItem key={index} routerLink={item.url} routerDirection="none">
              <IonIcon icon={item.icon} slot="start" />
              <IonLabel>{item.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Sidebar;
