// src/components/Auth/LoginForm.tsx

import React, { useState, useRef } from 'react';
import { getUsers, type UserData } from '../../utils/validation';

interface LoginFormProps {
    onSuccess: (user: UserData) => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
    // estado: usuario
    const [usuario, setUsuario] = useState('');
    // estado: contraseña
    const [password, setPassword] = useState('');
    // errores por campo
    const [fieldErrors, setFieldErrors] = useState<{usuario?:string; password?:string}>({});
    // mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    // Manejo del submit de login: validaciones simples y comprobación local
    // contra usuarios guardados en localStorage. No hacer aquí hashing ni
    // comprobaciones seguras — esto es un ejemplo educativo/local.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    // limpiar errores
    setFieldErrors({});
    const errors: Record<string, string> = {};

    // validación básica
    if (!usuario) errors.usuario = 'Ingresa tu usuario';
    if (!password) errors.password = 'Ingresa tu contraseña';
    if (Object.keys(errors).length) return setFieldErrors(errors);

    // buscar usuario registrado por nombre de usuario o nombre mostrado (case-insensitive)
    const users = getUsers();
    const needle = usuario.trim().toLowerCase();
    const found = users.find(u => (u.nombre_usu && u.nombre_usu.toLowerCase() === needle) || (u.nombre && u.nombre.toLowerCase() === needle));
    if (!found) {
        setFieldErrors({ usuario: 'Usuario no encontrado. Regístrate o verifica el nombre.' });
        return;
    }
    if (found.password !== password) {
        setFieldErrors({ password: 'Contraseña incorrecta.' });
        return;
    }

    // éxito: guardar sesión (incluye correo para detección admin)
    localStorage.setItem('currentUser', JSON.stringify({ nombre_usu: found.nombre_usu, nombre: found.nombre, correo: found.correo }));
    onSuccess(found as UserData);
    };

    return (
        <form id="loginForm" onSubmit={handleSubmit} noValidate>
            <h2>Iniciar Sesión</h2>

            <div className="form-body">
            <label className="field">
                {/* campo: usuario */}
                <input type="text" id="usuario" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
                {fieldErrors.usuario && <div className="field-error">{fieldErrors.usuario}</div>}
            </label>

            <label className="field password-field">
                {/* campo: contraseña */}
                <div className="password-inner">
                    <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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
                            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
                        </div>

                        <button type="submit" className="btn-primary">Ingresar</button>
            <p className="link">¿No tienes cuenta? <a onClick={onSwitchToRegister}>Regístrate</a></p>
        </form>
    );
};

export default LoginForm;