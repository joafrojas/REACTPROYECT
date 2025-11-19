// src/components/Auth/RegisterForm.tsx

import React, { useState, useRef } from 'react';
import { 
    validarRut, 
    validarCorreo, 
    validarPassword, 
    validarEdad,
    getUsers, 
    saveUser,
    isValidAdminToken,
} from '../../utils/validation';
import type { UserData } from '../../utils/validation';

interface RegisterFormProps {
    onSuccess: () => void; // Función para cambiar a Login al registrarse
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    // datos del formulario
    const [formData, setFormData] = useState<UserData>({
        rut: '', nombre: '', fecha_nac: '', correo: '', nombre_usu: '', password: ''
    });
    const [adminToken, setAdminToken] = useState('');
    // mensaje de error
    const [error, setError] = useState('');
    // mensaje de éxito
    const [success, setSuccess] = useState('');
    // mostrar/ocultar contraseña (toggle ojo)
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    // manejar cambios en inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (e.target.id === 'rut') {
            value = value.replace(/[^0-9Kk]/g, '').toUpperCase();
            if (value.length > 1) {
                const body = value.slice(0, -1);
                const dv = value.slice(-1);
                value = body + (body ? '-' : '') + dv;
            }
        }
        setFormData({ ...formData, [e.target.id]: value });
        // limpiar error al editar
        setError(''); 
    };

    const handleAdminTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminToken(e.target.value);
        setError('');
    };

    // Manejo del submit del registro: realiza validaciones básicas y guarda
    // el usuario en localStorage mediante `saveUser`. Esta lógica es local
    // y educativa; en producción habría que enviar los datos a un backend
    // con control de contraseñas y validaciones en servidor.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 1. validaciones básicas
        if (!validarRut(formData.rut)) return setError('RUT inválido. Formato: 12345678-K');
        if (!formData.nombre.trim()) return setError('Ingresa tu nombre.');
        if (!validarEdad(formData.fecha_nac)) return setError('Debes ser mayor de 18 años.');
        if (!validarCorreo(formData.correo)) return setError('Correo inválido.');
        if (!formData.nombre_usu.trim()) return setError('Ingresa un nombre de usuario.');
        if (!validarPassword(formData.password)) return setError('Contraseña debe tener al menos 6 caracteres.');

        // 2. verificar unicidad
        const users = getUsers();
        if (users.some(u => u.rut === formData.rut)) return setError('El RUT ya está registrado.');
        if (users.some(u => u.correo === formData.correo)) return setError('El correo ya está registrado.');
        if (users.some(u => u.nombre_usu === formData.nombre_usu)) return setError('El usuario ya está registrado.');

        // 2.5 Si el correo es @asfaltofashion.cl, exigir token de admin para marcar isAdmin
        let isAdminFlag = false;
        try {
            const domain = formData.correo.split('@')[1] || '';
            if (domain.toLowerCase() === 'asfaltofashion.cl') {
                if (!adminToken.trim()) return setError('Debes ingresar el token de administrador para correos @asfaltofashion.cl');
                if (!isValidAdminToken(adminToken.trim())) return setError('Token inválido.');
                isAdminFlag = true;
            }
        } catch (e) {
            // ignore
        }

        // 3. guardar usuario (localStorage)
        const toSave = { ...formData, ...(isAdminFlag ? { isAdmin: true } : {}) } as any;
        saveUser(toSave);
        setSuccess('Registro exitoso. Serás redirigido a Iniciar Sesión.');
        
        setTimeout(() => {
            onSuccess();
        }, 1500); 
    };

    return (
        <form id="registerForm" onSubmit={handleSubmit} noValidate>
            <h2>Regístrate</h2>

            <div className="form-body">
            <label className="field">
                <input type="text" id="rut" placeholder="RUT (ej: 12345678-k)" value={formData.rut} onChange={handleChange} />
            </label>
            <label className="field">
                <input type="text" id="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} />
            </label>
            
            <label htmlFor="fecha_nac" style={{fontSize: '12px', color: '#999', marginTop: '5px'}}>Fecha de Nacimiento</label>
            <label className="field">
                <input type="date" id="fecha_nac" value={formData.fecha_nac} onChange={handleChange} />
            </label>
            
            <label className="field">
                <input type="text" id="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} />
            </label>
            {/* Si el correo es del dominio asfaltofashion.cl, pedir token de admin */}
            {formData.correo.toLowerCase().endsWith('@asfaltofashion.cl') ? (
                <label className="field">
                    <input type="password" id="adminToken" placeholder="Token de administrador" value={adminToken} onChange={handleAdminTokenChange} />
                </label>
            ) : null}
            <label className="field">
                <input type="text" id="nombre_usu" placeholder="Nombre de usuario" value={formData.nombre_usu} onChange={handleChange} />
            </label>
            <label className="field password-field">
                <div className="password-inner">
                    <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Contraseña (mín. 6 chars)"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => {
                            setShowPassword(s => {
                                const next = !s;
                                setTimeout(() => passwordRef.current?.focus(), 0);
                                return next;
                            });
                        }}
                        aria-pressed={showPassword}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                </div>
            </label>

            </div>

            <div className="form-message">
                {error && <span className="field-error">{error}</span>}
                {success && <span className="field-success">{success}</span>}
            </div>
            <button type="submit" disabled={!!success} className="btn-primary">Registrar</button>
            <p className="link">¿Ya tienes cuenta? <a onClick={onSuccess}>Inicia sesión</a></p>
        </form>
    );
};

export default RegisterForm;