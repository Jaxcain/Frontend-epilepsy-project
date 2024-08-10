// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Login.css'



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    /*     const handleLogin = async () => {
            try {
                const response = await axios.post('http://localhost:8000/auth/login', {
                    email,
                    password,
                });
    
                console.log('Response:', response);
    
                if (response.data && response.data.access_token) {
                    const { access_token } = response.data;
    
                    // Decodifica el token para obtener la información del usuario
                    const decoded = jwtDecode(access_token);
                    console.log('Decoded token:', decoded);
    
                    // Verifica el rol del usuario
                    const userRole = decoded.roles; // Ajusta esto según el campo real en tu token
    
                    if (userRole === 'admin') {
                        // Almacena el token en localStorage
                        localStorage.setItem('access_token', access_token);
    
                        // Navega al dashboard
                        navigate('/dashboard');
                    } else {
                        alert('Acceso denegado: Solo los administradores pueden acceder');
                    }
                } else {
                    alert('Error: Credenciales inválidas');
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    alert(`Error al iniciar sesión: ${error.response.data.message || error.message}`);
                } else {
                    alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
                }
            }
        }; */

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password,
            });

            console.log('Response:', response);

            if (response.data && response.data.access_token) {
                const { access_token } = response.data;

                // Decodifica el token para obtener la información del usuario
                const decoded = jwtDecode(access_token);
                console.log('Decoded token:', decoded);

                // Verifica el rol del usuario
                const userRole = decoded.roles; // Ajusta esto según el campo real en tu token

                if (userRole === 'admin') {
                    // Almacena el token en localStorage
                    localStorage.setItem('access_token', access_token);

                    // Navega al dashboard
                    navigate('/dashboard');
                } else {
                    alert('Acceso denegado: Solo los administradores pueden acceder');
                }
            } else {
                alert('Error: Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                alert(`Error al iniciar sesión: ${error.response.data.message || error.message}`);
            } else {
                alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
            }
        }
    };


    /*     const handleSigui = () => {
            navigate('./dashboard')
    
        }; */


    return (
        <div className="login-container">
            <div className="login-card">
                <h1 > Plataforma DRA</h1>
                <h2 > Iniciar Sesión</h2>
                <p>Hola! Que bueno verte de nuevo</p>


                <p className='login-card-input-name'>Email:</p>
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className='login-card-input-name'>Contraseña:</p>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="login-button-container">

                    <button onClick={handleLogin}>Iniciar Sesión</button>

                </div>


                <div className="admin-panel-text">
                    <p>PANEL ADMINISTRADOR</p>
                </div>

            </div>

            {/*  <button onClick={handleSigui}>Siguiente</button> */}



        </div>
    );
};

export default Login;
