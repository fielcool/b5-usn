import React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

function CreateUserForm() {
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const [input, setInput] = useState({
    navn: "",
    organisasjon: "",
    stillingstittel: "",
    email: "",
    passord: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post('/api/createUser', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log("User registered successfully");
        return true;
      } else {
        console.log('Server response:', response.data);
        console.error("User registration failed");
        return false;
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', input);

    if (Object.values(input).some((value) => value === "")) {
      // Show modal alert or handle the empty fields case as needed
      return;
    }

    //legger form inputs inn i POST request som sendes til mongodb
    try {
      const { navn, organisasjon, stillingstittel, email, passord } = input;

      const isUserRegistered = await registerUser({
        navn,
        organisasjon,
        stillingstittel,
        email,
        passord,
      });
 
      //navigerer til Login siden
      if (isUserRegistered) {
        navigate('/LoginUser');  
      }
    } catch (error) {
      // Handle the error based on your application's requirements
    }
  };

  return (
    <div className="main">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="credentials-form m-credentials-form">
          {Object.keys(input).map((fieldName) => (
            <Form.Control
              key={fieldName}
              autoComplete="off"
              type={fieldName === 'passord' ? 'password' : 'text'}
              placeholder={`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}*`}
              name={fieldName}
              value={input[fieldName]}
              onChange={handleChange}
              className="credentials-input m-credentials-input"
            />
          ))}
        </Form.Group>
        <Button type="submit" variant="primary">
          opprett bruker
        </Button>
      </Form>
    </div>
  );
}

export default CreateUserForm;
