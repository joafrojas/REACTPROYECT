package microservicio.usuarios.service;

import microservicio.usuarios.dto.AuthResponse;
import microservicio.usuarios.dto.LoginRequest;
import microservicio.usuarios.dto.RegisterRequest;
import microservicio.usuarios.model.Rol;
import microservicio.usuarios.model.Usuarios;
import microservicio.usuarios.repository.UsuariosRepository;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    // Servicio de autenticación y registro.
    // - register: valida unicidad, asigna rol admin si corresponde y guarda
    //   la contraseña encriptada.
    // - login: valida credenciales y devuelve JWT.

    private final UsuariosRepository repo;
    private final PasswordEncoder encoder;

    // El token de administrador se lee desde application.properties
    @org.springframework.beans.factory.annotation.Value("${app.admin.token:}")
    private String adminToken;

    public AuthService(UsuariosRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public String register(RegisterRequest req) {

        if (repo.existsByRut(req.getRut())) return "RUT ya registrado";
        if (repo.existsByCorreo(req.getCorreo())) return "Correo ya registrado";
        if (repo.existsByNombreUsuario(req.getNombreUsuario())) return "Usuario ya registrado";

        Rol rol = Rol.ROLE_USER;
        boolean isAdminFlag = false;

        if (req.getCorreo().toLowerCase().endsWith("@asfaltofashion.cl")) {
            if (!adminToken.equals(req.getAdminToken()))
                return "Token de administrador inválido";

            rol = Rol.ROLE_ADMIN;
            isAdminFlag = true;
        }

    Usuarios user = Usuarios.builder()
                .rut(req.getRut())
                .nombre(req.getNombre())
                .fechaNac(req.getFechaNac())
                .correo(req.getCorreo())
                .nombreUsuario(req.getNombreUsuario())
                .password(encoder.encode(req.getPassword()))
        .rol(rol)
        .isAdmin(isAdminFlag)
                .build();

        repo.save(user);
        return "OK";
    }

    public AuthResponse login(LoginRequest req) {
        Usuarios user = repo.findByNombreUsuarioOrCorreo(req.getUsernameOrEmail(), req.getUsernameOrEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new IllegalArgumentException("Contraseña incorrecta");

        // Generador simple de token: UUID. No expira.
        String token = UUID.randomUUID().toString();
        return new AuthResponse(token, user.getNombreUsuario(), user.isAdmin(), user.getCreatedAt());
    }
}
