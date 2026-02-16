import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';

const Loading: React.FC = () => {
  return (
    <IonContent className="ion-padding ion-text-center">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <IonSpinner name="crescent" />
      </div>
    </IonContent>
  );
};

export default Loading;
