package microservicio.usuarios.bootstrap;

import microservicio.usuarios.model.Rol;
import microservicio.usuarios.model.Usuarios;
import microservicio.usuarios.repository.UsuariosRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataLoader {

    @Bean
    CommandLineRunner initAdmin(UsuariosRepository repo, PasswordEncoder encoder) {
        return args -> {
            try {
                if (repo.findByNombreUsuario("admin").isEmpty()) {
                    Usuarios admin = new Usuarios();
                    admin.setNombreUsuario("admin");
                    admin.setCorreo("admin@asfaltofashion.cl");
                    admin.setNombre("Admin");
                    admin.setRut("00000000-0");
                    admin.setPassword(encoder.encode("admin"));
                    admin.setAdmin(true);
                    admin.setRol(Rol.ROLE_ADMIN);
                    repo.save(admin);
                    System.out.println("Admin creado: admin / admin");
                }
            } catch (Exception e) {
                System.out.println("No se pudo crear admin: " + e.getMessage());
            }
        };
    }
}
