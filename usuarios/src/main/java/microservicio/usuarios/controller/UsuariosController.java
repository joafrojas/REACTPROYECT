package microservicio.usuarios.controller;

import microservicio.usuarios.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UsuariosController {

    private final UsuariosRepository repo;

    @Value("${app.admin.token:}")
    private String adminToken;

    public UsuariosController(UsuariosRepository repo) {
        this.repo = repo;
    }

    // Eliminar usuario por id — requiere token de administrador en header X-ADMIN-TOKEN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @RequestHeader(value = "X-ADMIN-TOKEN", required = false) String token) {
        if (token == null || !token.equals(adminToken)) {
            return ResponseEntity.status(403).body("Acceso denegado: token admin inválido");
        }
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
