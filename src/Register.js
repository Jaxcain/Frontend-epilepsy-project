import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Importa el archivo CSS aquí
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

    /*     const handleRegister = async (e) => {
            e.preventDefault();
            try {
                await axios.post('http://localhost:8000/register', {
                    email,
                    username,
                    password,
                });
                alert('Usuario registrado con éxito');
                navigate('/dashboard');
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
            }
        }; */


    const handleRegister = async (e) => {
        e.preventDefault();
        if (email && username && password  ) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert('Error: El correo electrónico no es válido. Por favor, ingrese un correo electrónico válido.');
                return;
            }
            try {
                console.log('Request data:', { username, email, password });
                const response = await axios.post(`${apiUrl}/auth/register`, {
                    name: username,
                    email,
                    password,
                });
                console.log('Response:', response);
                if (response && response.data) {
                    console.log('Registro exitoso:', response.data);
                    navigate('/dashboard');
                } else {
                    console.error('Error durante el registro:', response);
                    alert('Error: Error durante el registro. Por favor intente de nuevo.');
                }
            } catch (error) {
                console.log(error.response.status);
                console.log(error.message);

                if (error.response) {
                    if (error.response.status === 400) {
                        const errorMessage = error.response.data.message;
                        console.log(errorMessage);

                        if (errorMessage === 'email already exists') {
                            alert('Error: El correo electrónico ya existe. Por favor, cambie el correo electrónico y vuelva a intentarlo.');
                            setEmail('');
                        } else if (errorMessage === 'User already exists') {
                            alert(`Error: El nombre de usuario ${username} ya existe. Por favor, cambie el nombre de usuario y vuelva a intentarlo.`);
                            setUsername('');
                        }
                    } else {
                        alert('Error: Error durante el registro. Por favor intente de nuevo.');
                    }
                } else {
                    console.error('Error durante el registro:', error.message);
                    alert('Error: Error durante el registro. Por favor intente de nuevo.');
                }
            }
        } else {
            alert('Error: Por favor llene todos los campos.');
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="register-container">
            {/* <button type="button" onClick={handleBackToDashboard} className="back-button">Volver al Dashboard</button> */}
            <button type="button" onClick={handleBackToDashboard} className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className="register-card">
                <h2>REGISTRO DE USUARIO</h2>
                <p>Llene los campos para crear un nuevo usuario</p>

                <form onSubmit={handleRegister}>
                    <p className='register-card-input-name'>Email:</p>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <p className='register-card-input-name'>Nombre de usuario:</p>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <p className='register-card-input-name'>Contraseña:</p>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Registrar</button>


                </form>
            </div>
        </div>
    );
};

export default Register;