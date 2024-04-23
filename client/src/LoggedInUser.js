import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";  
import UpdateUserInfoForm from "./UpdateUserInfoForm"; 
import PersonalityTestIdForm from "./PersonalityTestIdForm"; 

const LoggedInUser = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const { authToken, logout } = useAuth();  
  const [showUpdateForm, setShowUpdateForm] = useState(false); 

  const handleDeleteAccount = async () => {
    console.log('Auth Token:', authToken);
  
    console.log('Request headers:', {
      Authorization: `Bearer ${authToken}`,
    });
  
    try {
      const userPassword = password;
  
      const response = await axios.delete('https://b5-usn-506fb35bcb0a.herokuapp.com/api/user', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
        data: {
          password: userPassword,
        },
      });
  
      if (response.status === 200) {
        console.log('Account deleted successfully');
        logout();
        navigate('/');
      } else {
        console.error('Failed to delete account:', response.data);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
  
      console.log(error);
  
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      }
    } finally {
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setShowModal(false);
  };

  const handleUpdateUserInfo = () => {
    setShowUpdateForm(true);
  };

  return (
    <div className="main">
      <Card style={{ width: '44rem' }}>
        <Card.Body>
          <Card.Title>Din profil</Card.Title>
          <Button variant="danger" onClick={() => setShowModal(true)}>
            Slett bruker
          </Button>

          <Button variant="primary" onClick={handleUpdateUserInfo}>
            Oppdater brukerinformasjon
          </Button>

          <PersonalityTestIdForm authToken={authToken} />

          <Modal show={showModal} onHide={handleCancel}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please enter your password to confirm deletion:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Confirm Deletion
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>

      {showUpdateForm && <UpdateUserInfoForm />}
    </div>
  );
};

export default LoggedInUser;
