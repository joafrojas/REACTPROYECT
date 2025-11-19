
import { useState, useEffect } from 'react';
import PaginaAuth from './components/Pages/PaginaAuth';
import PaginaCarga from './components/Pages/PaginaCarga';
import PaginaPrincipal from './components/Pages/PaginaPrincipal';
import PaginaFFXIV from './components/Pages/PaginaFFXIV';
import PaginaColecciones from './components/Pages/PaginaColecciones';
import PaginaThug from './components/Pages/PaginaThug';
import PaginaGalegale from './components/Pages/PaginaGalegale';
import PaginaPost from './components/Pages/PaginaPost';
import PaginaContacto from './components/Pages/PaginaContacto';
import PaginaAdmin from './components/Pages/PaginaAdmin';
import Footer from './components/Footer';
import { getActiveUser, getUsers, saveUser, type UserData } from './utils/validation';

function App() {
    // Estado principal de la app: usuario actualmente autenticado.
    // Se inicializa con `getActiveUser()` para mantener la sesión
    // si el usuario ya había iniciado sesión en esta máquina.
    const [currentUser, setCurrentUser] = useState<UserData | null>(getActiveUser());
    const [isAwaitingRedirect, setIsAwaitingRedirect] = useState(false);

    // --- Inicializar admin pre-creado ---
    // Si quieres que exista un admin con credenciales conocidas al abrir la
    // aplicación (por ejemplo al clonar el repo), lo creamos aquí en
    // localStorage si aún no existe. NOTA: esto NO hace login automático,
    // solo asegura que el usuario existe para que puedas iniciar sesión.
    useEffect(() => {
        try {
            const demo = { rut: '1-9', nombre: 'Admin Uno', fecha_nac: '1990-01-01', correo: 'admin@asfaltofashion.cl', nombre_usu: 'admin01', password: 'abc123' } as UserData;
            const users = getUsers();
            const exists = users.some(u => u.nombre_usu === demo.nombre_usu || u.correo === demo.correo);
            if (!exists) {
                // Guardar el admin demo en la lista de usuarios.
                saveUser(demo);
            }
        } catch (e) {
            // silencioso: si algo falla, no bloqueamos la app
        }
    }, []);

    // Se ejecuta al ingresar credenciales correctas en LoginForm
    const handleLoginSuccess = (user: UserData) => {
        setCurrentUser(user);
        setIsAwaitingRedirect(true); // Activa la página de carga
    };
    
    // Se ejecuta cuando la PaginaCarga termina su temporizador
    const handleCargaComplete = () => {
        setIsAwaitingRedirect(false);
        // La vista principal se renderiza automáticamente porque currentUser != null
    };

    // Función para cerrar sesión.
    // - Limpia las claves relacionadas con la sesión en localStorage.
    // - Actualiza el estado local para forzar render de la pantalla de login.
    // - Redirige al root para evitar estados inconsistentes si el usuario
    //   estaba viendo rutas que requieren autenticación.
    const handleLogout = () => {
        try {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isAdmin');
        } catch (e) {
            // Si localStorage falla por alguna razón, seguimos con el logout
        }
        setCurrentUser(null);
        if (typeof window !== 'undefined') {
            // Recarga la app y muestra la pantalla de autenticación.
            window.location.href = '/';
        }
    }
    
    // 1. RENDERIZAR LA PÁGINA DE CARGA SI ESTÁ ACTIVA (no footer aquí)
    if (isAwaitingRedirect && currentUser) {
        return <PaginaCarga user={currentUser} onComplete={handleCargaComplete} />;
    }

    // 2. Determinar la página a renderizar en base al pathname (mantener accesos públicos)
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    let pageElement: any;

    // Si la ruta raíz '/' se carga, mostramos login sólo si no hay sesión activa.
    if (path === '/') {
        if (currentUser) {
            pageElement = <PaginaPrincipal currentUser={currentUser} onLogout={handleLogout} />;
        } else {
            pageElement = <PaginaAuth onLoginSuccess={handleLoginSuccess} />;
        }
    } else if (path === '/ffxiv') {
        pageElement = <PaginaFFXIV />;
    } else if (path === '/colecciones') {
        pageElement = <PaginaColecciones />;
    } else if (path === '/thug') {
        pageElement = <PaginaThug />;
    } else if (path === '/vsa' || path === '/galegale') {
        pageElement = <PaginaGalegale />;
    } else if (path === '/contacto') {
        pageElement = <PaginaContacto />;
    } else if (path === '/admin') {
        pageElement = <PaginaAdmin />;

    } else if (path.startsWith('/post/')) {
        pageElement = <PaginaPost />;
    } else if (currentUser) {
        // Usuario autenticado: mostrar página principal
        pageElement = <PaginaPrincipal currentUser={currentUser} onLogout={handleLogout} />;
    } else {
        // Usuario no autenticado y ruta no pública: mostrar auth
        pageElement = <PaginaAuth onLoginSuccess={handleLoginSuccess} />;
    }

    // 3. Mostrar footer en todas las páginas excepto la de autenticación (PaginaAuth)
    const showFooter = !(pageElement && (pageElement.type === PaginaAuth));

    return (
        <>
            {pageElement}
            {showFooter ? <Footer /> : null}
        </>
    );
}

export default App;