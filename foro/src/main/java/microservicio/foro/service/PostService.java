package microservicio.foro.service;

import microservicio.foro.model.Comment;
import microservicio.foro.model.Post;
import microservicio.foro.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository repo;

    public PostService(PostRepository repo) {
        this.repo = repo;
    }

    // Listar todas las publicaciones ordenadas por fecha de creación (descendente)
    public List<Post> listarTodas() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    // Buscar por id numérico
    public Optional<Post> buscarPorId(Long id) {
        return repo.findById(id);
    }

    // Buscar por externalId 
    public Optional<Post> buscarPorExternalId(String externalId) {
        return repo.findByExternalId(externalId);
    }

    // Buscar por identificador genérico: si es numérico busca por id, si no por externalId
    public Optional<Post> buscarPorIdentificador(String idOrExternal) {
        if (idOrExternal == null) return Optional.empty();
        try {
            Long numeric = Long.parseLong(idOrExternal);
            return buscarPorId(numeric);
        } catch (NumberFormatException nfe) {
            return buscarPorExternalId(idOrExternal);
        }
    }

    // Crear una publicación
    public Post crear(Post p) {
        // Generar externalId si no viene desde el cliente
        if (p.getExternalId() == null || p.getExternalId().isBlank()) {
            String candidate = "p" + System.currentTimeMillis();
            int attempts = 0;
            while (repo.findByExternalId(candidate).isPresent() && attempts < 5) {
                candidate = "p" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
                attempts++;
            }
            p.setExternalId(candidate);
        }
        return repo.save(p);
    }

    // Eliminar por id
    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    // Agregar comentario a una publicación
    public Comment agregarComentario(Long postId, Comment c) {
        Post p = repo.findById(postId).orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));
        p.getComments().add(c);
        repo.save(p);
        return c;
    }

    // Eliminar comentario por id
    public void eliminarComentario(Long postId, Long commentId) {
        Post p = repo.findById(postId).orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));
        p.getComments().removeIf(cm -> cm.getId() != null && cm.getId().equals(commentId));
        repo.save(p);
    }

    // Alternar like para un usuario en una publicación
    public Post alternarLike(Long postId, String userId) {
        Post p = repo.findById(postId).orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));
        if (p.getLikes().contains(userId)) p.getLikes().remove(userId); else p.getLikes().add(userId);
        return repo.save(p);
    }
}
