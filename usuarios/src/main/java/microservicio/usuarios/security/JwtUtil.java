package microservicio.usuarios.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import microservicio.usuarios.model.Usuarios;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey SECRET_KEY;

    public JwtUtil(@Value("${app.jwt.secret:}") String secret) {
        String s = (secret == null) ? "" : secret;
        byte[] bytes = s.getBytes(StandardCharsets.UTF_8);
        // Asegurar al menos 32 bytes (256 bits) necesarios para HS256
        if (bytes.length < 32) {
            // rellenar con un patrón reproducible hasta 32 bytes
            StringBuilder sb = new StringBuilder(s);
            while (sb.toString().getBytes(StandardCharsets.UTF_8).length < 32) {
                sb.append("_ASFLATO_PAD_");
            }
            s = sb.toString();
            bytes = s.getBytes(StandardCharsets.UTF_8);
        }
        this.SECRET_KEY = Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(Usuarios user) {
        return Jwts.builder()
                .setSubject(user.getNombreUsuario())
                .claim("rol", user.getRol().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86_400_000)) // 1 día
                .signWith(SECRET_KEY)
                .compact();
    }
}
