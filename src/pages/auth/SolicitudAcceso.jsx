// src/pages/auth/SolicitudAcceso.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate

// 💡 Ya NO importamos './SolicitudAcceso.css'
// Tu index.css global se encargará de los estilos.

// Si tienes un logo, descomenta la línea
// import logo from '../../assets/certify-logo.png'; 

const SolicitudAcceso = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        nombreEmpresa: '',
        razonSocial: '',
        ruc: ''
    });
    
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Lógica para enviar al backend
        console.log("Enviando solicitud:", formData);
        
        // 2. Mensaje de éxito
        alert('¡Tu solicitud ha sido enviada! Un administrador la revisará pronto.');

        // 3. Redirigir al Login
        navigate('/login');
    };

    return (
        // Contenedor principal para centrar el formulario
        <div className="form-page-wrapper"> 
            {/* Contenedor del formulario con sombra */ }
            <div className="form-container">
                <div className="form-header">
                    {/* {logo && <img src={logo} alt="Certify Logo" className="form-logo" />} */}
                    <h2 className="form-title">Solicitud de Acceso para Empresas</h2>
                    <p className="form-subtitle">Completa el formulario y nos pondremos en contacto contigo.</p>
                </div>

                <form onSubmit={handleSubmit} className="form-body">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del Contacto</label>
                        <input 
                            type="text" 
                            id="nombre"
                            name="nombre" 
                            className="form-control" // Clase para estilizar inputs
                            value={formData.nombre}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            className="form-control" // Clase para estilizar inputs
                            value={formData.email}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombreEmpresa">Nombre de la Empresa</label>
                        <input 
                            type="text" 
                            id="nombreEmpresa"
                            name="nombreEmpresa" 
                            className="form-control"
                            value={formData.nombreEmpresa}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="razonSocial">Razón Social</label>
                        <input 
                            type="text" 
                            id="razonSocial"
                            name="razonSocial" 
                            className="form-control"
                            value={formData.razonSocial}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ruc">RUC</label>
                        <input 
                            type="text" 
                            id="ruc"
                            name="ruc" 
                            className="form-control"
                            value={formData.ruc}
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary"> {/* Clase para botón primario */}
                        Enviar Solicitud
                    </button>
                </form>

                <div className="form-footer"> {/* Footer para enlaces */}
                    ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default SolicitudAcceso;