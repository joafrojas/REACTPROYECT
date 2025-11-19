package microservicio.usuarios.service;

import microservicio.usuarios.dto.AuthResponse;
import microservicio.usuarios.dto.LoginRequest;
import microservicio.usuarios.dto.RegisterRequest;
import microservicio.usuarios.model.Rol;
import microservicio.usuarios.model.Usuarios;
import microservicio.usuarios.repository.UsuariosRepository;
import microservicio.usuarios.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuariosRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    private static final String ADMIN_TOKEN = "ASFALTO-ADMIN-2025";

    public AuthService(UsuariosRepository repo, PasswordEncoder encoder, JwtUtil jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public String register(RegisterRequest req) {

        if (repo.existsByRut(req.getRut())) return "RUT ya registrado";
        if (repo.existsByCorreo(req.getCorreo())) return "Correo ya registrado";
        if (repo.existsByNombreUsuario(req.getNombreUsuario())) return "Usuario ya registrado";

        Rol rol = Rol.ROLE_USER;

        if (req.getCorreo().toLowerCase().endsWith("@asfaltofashion.cl")) {
            if (!ADMIN_TOKEN.equals(req.getAdminToken()))
                return "Token de administrador inválido";

            rol = Rol.ROLE_ADMIN;
        }

        Usuarios user = Usuarios.builder()
                .rut(req.getRut())
                .nombre(req.getNombre())
                .fechaNac(req.getFechaNac())
                .correo(req.getCorreo())
                .nombreUsuario(req.getNombreUsuario())
                .password(encoder.encode(req.getPassword()))
                .rol(rol)
                .build();

        repo.save(user);
        return "OK";
    }

    public AuthResponse login(LoginRequest req) {
        Usuarios user = repo.findByNombreUsuarioOrCorreo(req.getUsernameOrEmail(), req.getUsernameOrEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new IllegalArgumentException("Contraseña incorrecta");

        String token = jwt.generateToken(user);
        return new AuthResponse(token, user.getNombreUsuario(), user.isAdmin());
    }
}
