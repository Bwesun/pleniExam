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
  IonButton,
  IonSearchbar,
  IonBadge,
  IonToast,
  IonAlert,
} from '@ionic/react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { userService } from '../../services/user.service';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await userService.updateUserStatus(userId, !isActive);
      setToastMessage(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
      setShowToast(true);
      loadUsers();
    } catch (error: any) {
      setToastMessage(error.response?.data?.message || 'Failed to update user status');
      setShowToast(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete);
      setToastMessage('User deleted successfully');
      setShowToast(true);
      loadUsers();
    } catch (error: any) {
      setToastMessage(error.response?.data?.message || 'Failed to delete user');
      setShowToast(true);
    } finally {
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage id="main-content">
      <Sidebar />
      <Header title="User Management" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Manage Users</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonSearchbar
              value={searchText}
              onIonChange={(e) => setSearchText(e.detail.value!)}
              placeholder="Search users..."
            />
          </IonCardContent>
        </IonCard>

        <IonList>
          {filteredUsers.map((user) => (
            <IonCard key={user._id}>
              <IonCardContent>
                <IonItem>
                  <IonLabel>
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                    <p>
                      {user.firstName} {user.lastName}
                    </p>
                  </IonLabel>
                  <IonBadge color={user.role === 'admin' ? 'danger' : user.role === 'instructor' ? 'warning' : 'primary'}>
                    {user.role}
                  </IonBadge>
                  <IonBadge color={user.isActive ? 'success' : 'medium'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </IonBadge>
                </IonItem>
                <IonButton
                  size="small"
                  fill="outline"
                  onClick={() => toggleUserStatus(user._id, user.isActive)}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </IonButton>
                <IonButton
                  size="small"
                  fill="outline"
                  color="danger"
                  onClick={() => setUserToDelete(user._id)}
                >
                  Delete
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />

        <IonAlert
          isOpen={!!userToDelete}
          onDidDismiss={() => setUserToDelete(null)}
          header="Confirm Delete"
          message="Are you sure you want to delete this user?"
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            { text: 'Delete', handler: handleDeleteUser },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default UserManagement;
