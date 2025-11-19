import React from 'react';
import { getActiveUser } from '../utils/validation';

/* NavBar
     - Controla la navegación principal y muestra el enlace ADMIN si el usuario
         actual tiene un correo con dominio @asfaltofashion.cl.
     - Para determinar admin se usan dos fuentes: la clave `currentUser` en
         localStorage (sesión rápida) y `getActiveUser()` que busca el usuario
         completo en la lista de usuarios (por si se necesita información extra).
*/

const NavBar: React.FC<{ onLogout?: () => void; onNavigate?: (target: string) => void }> = ({ onLogout, onNavigate }) => {
    // Mostrar ADMIN únicamente si el usuario actualmente logueado tiene un correo terminado en @asfaltofashion.cl
    let isAdmin = false;
    try {
        const raw = localStorage.getItem('currentUser');
        if (raw) {
            const parsed = JSON.parse(raw) as any;
            if (parsed && typeof parsed.correo === 'string' && parsed.correo.toLowerCase().endsWith('@asfaltofashion.cl')) {
                isAdmin = true;
            }
        }
        // como respaldo, intentar obtener el usuario activo desde helper
        if (!isAdmin) {
            const full = getActiveUser();
            // permitir que el usuario tenga un flag isAdmin en su registro
            if (full && (full as any).isAdmin === true) isAdmin = true;
            // mantener compatibilidad con el dominio de correo
            if (!isAdmin && full && typeof full.correo === 'string' && full.correo.toLowerCase().endsWith('@asfaltofashion.cl')) isAdmin = true;
        }
    } catch (e) {}

    

    return (
        <header className="main-nav-container">
            <nav className="navbarAsfalto">
                <ul className="menuNav menuNav-left">
                    <li>
                        {/* ir al inicio (recarga) */}
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            // si no estamos en la raíz, navegamos al inicio
                            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                                window.location.href = '/';
                                return;
                            }
                            onNavigate && onNavigate('todos');
                        }}>INICIO</a>
                    </li>
                    <li>
                        {/* ir a colecciones */}
                        <a href="#" onClick={(e) => { e.preventDefault(); if (typeof window !== 'undefined' && window.location.pathname !== '/colecciones') { window.location.href = '/colecciones'; } else { onNavigate && onNavigate('colecciones'); } }}>COLECCIÓN</a>
                    </li>
                </ul>

                <div className="logoNav">
                    <img src="/IMG/asfaltofashion.png" alt="ASFALTO FASHION Logo" className="nav-logo-img" />
                </div>

                <ul className="menuNav menuNav-right">
                    {/* contacto (ruta) */}
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); if (typeof window !== 'undefined' && window.location.pathname !== '/contacto') { window.location.href = '/contacto'; } else { onNavigate && onNavigate('contacto'); } }}>CONTACTO</a>
                    </li>
                    {isAdmin ? (
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); if (typeof window !== 'undefined' && window.location.pathname !== '/admin') { window.location.href = '/admin'; } else { onNavigate && onNavigate('admin'); } }}>ADMIN</a>
                        </li>
                    ) : null}
                <li className="nav-user-item">
                    {/* Botón de cerrar sesión: si el padre pasó `onLogout` lo usamos,
                        sino hacemos una navegación al root como comportamiento por
                        defecto. Esto mantiene la barra de navegación usable sin
                        necesidad de que todos los padres implementen onLogout. */}
                    <button onClick={() => { if (onLogout) onLogout(); else window.location.href = '/'; }} className="logout-btn">Cerrar Sesión</button>
                </li>
                </ul>
            </nav>
        </header>
    );
};

export default NavBar;
