// src/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Importa el archivo CSS aquí
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
//import { io } from 'socket.io-client'

//const apiUrl = process.env.REACT_APP_API_URL;

const Dashboard = ({ socket }) => {

  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEmergency, setShowNewEmergency] = useState(false);
  const [highlightedEmergency, setHighlightedEmergency] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchPatientHistory = useCallback(async (query = '') => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${apiUrl}/seizure-data${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedData = response.data.map(patient => ({
        ...patient,
        dataValues: patient.dataValues.sort((a, b) => new Date(b.registerAt) - new Date(a.registerAt))
      }));
      setPatientHistory(sortedData);
      console.log(sortedData);
    } catch (error) {
      console.error('Error al obtener el historial de pacientes:', error);
      alert('Error al obtener el historial de pacientes. Por favor, inténtalo de nuevo.');
    }
  }, [apiUrl]);
  
  
  useEffect(() => {

    const storedEmergencies = JSON.parse(localStorage.getItem('emergencies')) || [];
    setEmergencies(storedEmergencies);

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
    } else {
      const decoded = jwtDecode(token);
      const userRole = decoded.roles;

      if (userRole !== 'admin') {
        alert('Acceso denegado: Solo los administradores pueden acceder');
        navigate('/');
      } else {
        fetchPatientHistory();
      }
    }
  }, [navigate, fetchPatientHistory]);



  /*   const fetchPatientHistory = async (query = '') => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/seizure-data${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatientHistory(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error al obtener el historial de pacientes:', error);
        alert('Error al obtener el historial de pacientes. Por favor, inténtalo de nuevo.');
      }
    }; */

/*   const fetchPatientHistory = async (query = '') => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${apiUrl}/seizure-data${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedData = response.data.map(patient => ({
        ...patient,
        dataValues: patient.dataValues.sort((a, b) => new Date(b.registerAt) - new Date(a.registerAt))
      }));
      setPatientHistory(sortedData);
      console.log(sortedData);
    } catch (error) {
      console.error('Error al obtener el historial de pacientes:', error);
      alert('Error al obtener el historial de pacientes. Por favor, inténtalo de nuevo.');
    }
  }; */



  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      fetchPatientHistory();
    } else {
      fetchPatientHistory(`?patientName=${e.target.value}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleCrisisAttended = async (id, name, bpm, so2, location) => {
    const date = new Date();  // Captura la fecha y hora actuales
    const dateIsoString = date.toISOString();

    console.log('Parámetros recibidos:', { id, name, bpm, so2, location, date: dateIsoString });


    try {
      const token = localStorage.getItem('access_token');
      const valueBpm = parseInt(bpm, 10);
      if (isNaN(valueBpm)) {
        throw new Error("El valor BPM debe ser un número entero");
      }

      const valueSo2 = Number(so2);
      if (isNaN(valueSo2)) {
        throw new Error("El valor de movimiento debe ser un número");
      }

      const data = {
        pacientName: name,
        valueBpm: valueBpm,
        valueSo2: valueSo2,
        registerAt: dateIsoString,
        location: location
      };
      console.log('Datos enviados al servidor:', data);


      const response = await axios.post(`${apiUrl}/seizure-data`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta del servidor:', response.data);

      //setEmergencies(prevEmergencies => prevEmergencies.filter(emergency => emergency.id !== id));

      const updatedEmergencies = emergencies.filter(emergency => emergency.id !== id);
      localStorage.setItem('emergencies', JSON.stringify(updatedEmergencies));
      setEmergencies(updatedEmergencies);

      //?Reemplazo esto:
      //fetchPatientHistory();

      //?Por esto:
      /* setPatientHistory(prevHistory => [{ pacientName: name, valueBpm, valueMotion, registerAt: dateIsoString, location }, ...prevHistory]); */

      const newPatientHistory = {
        pacientName: name,
        dataValues: [{
          valueBpm,
          valueSo2,
          registerAt: dateIsoString,
          location
        }]
      };
      setPatientHistory(prevHistory => [newPatientHistory, ...prevHistory]);


    } catch (error) {
      console.error('Error al atender la crisis:', error.response ? error.response.data : error.message);
      alert(`Error al atender la crisis: ${error.response ? error.response.data : error.message}. Por favor, inténtalo de nuevo.`);
    }
  }


  //? Reeemplazo esto:
  /* 
  useEffect(() => {
    if (!socket) return;

    // Manejar la recepción de datos de emergencia del servidor
    const handleEmergencyData = (data) => {
      console.log('Nueva emergencia recibida:', data);
      // Generar un ID único para la emergencia (en este caso usamos la fecha y hora como ID)
      const emergencyId = new Date().toISOString();
      
      
      setEmergencies(prevEmergencies => [{ ...data, id: emergencyId }, ...prevEmergencies]);
    };

    // Escuchar eventos de datos de emergencia del servidor
    socket.on('alertToDashboard', handleEmergencyData);

    return () => {
      // Desuscribirse del evento cuando el componente se desmonta
      socket.off('alertToDashboard', handleEmergencyData);
      console.log('Conexión WebSocket cerrada');
    };
  }, [socket]);
 */
  const handleDismissEmergency = (id) => {
    const updatedEmergencies = emergencies.filter(emergency => emergency.id !== id);
    localStorage.setItem('emergencies', JSON.stringify(updatedEmergencies));
    setEmergencies(updatedEmergencies);
  }


  //! Por esto: 

  useEffect(() => {
    if (!socket) return;

    // Manejar la recepción de datos de emergencia del servidor
    const handleEmergencyData = (data) => {
      console.log('Nueva emergencia recibida:', data);
      const emergencyId = new Date().toISOString();
      const newEmergency = { ...data, id: emergencyId };

      // Guardar la nueva emergencia en localStorage
      const storedEmergencies = JSON.parse(localStorage.getItem('emergencies')) || [];
      localStorage.setItem('emergencies', JSON.stringify([newEmergency, ...storedEmergencies]));

      // Actualizar el estado local
      setEmergencies(prevEmergencies => [newEmergency, ...prevEmergencies]);
      setShowNewEmergency(true);
      setHighlightedEmergency(newEmergency);
      setTimeout(() => {
        setShowNewEmergency(false);
        setHighlightedEmergency(null);
      }, 2000);
    };

    // Escuchar eventos de datos de emergencia del servidor
    socket.on('alertToDashboard', handleEmergencyData);

    return () => {
      socket.off('alertToDashboard', handleEmergencyData);
      console.log('Conexión WebSocket cerrada');
    };
  }, [socket]);



  return (

    <div className="dashboard-container">

      {/* Banner superior */}
      <div className="banner">
        <div className="company-name">Plataforma DRA</div>
        <div className="banner-buttons">
          <button onClick={handleRegisterRedirect} className="register-button">Registrar Usuario</button>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </div>

      {/* Cuerpo de la pantalla */}
      <div className="dashboard-body">

        {/* Historial crisis de pacientes */}
        <div className="patient-history">

          <h2>HISTORIAL CRISIS REGISTRADAS DE PACIENTES</h2>

          {/* Barra de búsqueda */}
          <input
            type="text"
            placeholder="Buscar..."
            className="search-bar"
            value={searchQuery}
            onChange={handleSearch}
          />

          <table className="patient-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha (A/M/D)</th>
                <th>Hora</th>
                <th>BPM</th>
                <th>So2</th>
                <th>Ubicacion</th>
              </tr>
            </thead>
            <tbody>

              {/*               {patientHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">Sin crisis registradas</td>
                </tr>
              ) : (
                patientHistory.map((patient, index) => (
                  patient.dataValues && patient.dataValues.map((data, dataIndex) => (
                    <tr key={`${index}-${dataIndex}`}>

                      <td>{patient.pacientName}</td>
                      <td>{new Date(data.registerAt).toISOString().slice(0, 10)}</td>
                      <td>{new Date(data.registerAt).toLocaleTimeString()}</td>
                      <td>{data.valueBpm}</td>
                      <td>{data.valueMotion}</td>
                      <td>{data.location}</td>
                    </tr>
                  ))
                ))
              )} */}

              {/*               {patientHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">Sin crisis registradas</td>
                </tr>
              ) : (
                patientHistory.map((patient, index) => (
                  <tr key={index}>
                    <td>{patient.pacientName}</td>
                    <td>{new Date(patient.registerAt).toISOString().slice(0, 10)}</td>
                    <td>{new Date(patient.registerAt).toLocaleTimeString()}</td>
                    <td>{patient.valueBpm}</td>
                    <td>{patient.valueMotion}</td>
                    <td>{patient.location}</td>
                  </tr>
                ))
              )} */}


              {patientHistory.length === 0 ? (
                <tr>
                  <td colSpan="2" className="no-data">Sin crisis registradas</td>
                </tr>
              ) : (
                patientHistory.flatMap((patient, index) => (
                  patient.dataValues.map((data, dataIndex) => (
                    <tr key={`${index}-${dataIndex}`}>
                      <td>{patient.pacientName}</td>
                      <td>{new Date(data.registerAt).toISOString().slice(0, 10)}</td>
                      <td>{new Date(data.registerAt).toLocaleTimeString()}</td>
                      <td>{data.valueBpm}</td>
                      <td>{data.valueSo2}</td>
                      <td className='location'>{data.location}</td>
                    </tr>
                  ))
                ))
              )}

            </tbody>
          </table>

        </div>

        {/* Últimas emergencias */}
        <div className="emergency-list">
          {showNewEmergency && <div className="new-emergency-message">Nueva emergencia</div>}
          <h2>ULTIMAS EMERGENCIAS</h2>

          {/* Renderiza la lista de últimas emergencias aquí */}
          {emergencies.map((emergency, index) => (


            //<div key={index} className="emergency-card">
            <div key={index} className={`emergency-card ${highlightedEmergency === emergency ? 'highlighted' : ''}`}>
              <div className='emergency-card-name' style={{ textTransform: 'uppercase' }}><strong>{emergency.name}</strong> </div>
              <div className='emergency-card-ubi-bpm'><strong>Ubicación: </strong>{emergency.location}</div>

              {/*    <div><strong >ISO:</strong> {new Date(emergency.date).toISOString()}</div> */}
              <div className='emergency-card-ubi-bpm'><strong >Fecha:</strong> {new Date(emergency.date).toISOString().slice(0, 10)}</div>
              {/*  <div><strong >Hora:</strong> {new Date(emergency.date).toLocaleTimeString()}</div> */}

              {/* <div><strong >Fecha:</strong> {emergency.date}</div> */}
              <div className='emergency-card-ubi-bpm'><strong >Valor BPM:</strong> {emergency.bpm}</div>
              <div className='emergency-card-ubi-bpm'><strong >Valor So2:</strong> {emergency.so2}</div>

              <button className='emergency-card-button' onClick={() => handleCrisisAttended(emergency.id, emergency.name, emergency.bpm, emergency.so2, emergency.location)}>Atender Crisis</button>
              <FontAwesomeIcon icon={faTimes} className="dismiss-icon" onClick={() => handleDismissEmergency(emergency.id)} />

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;