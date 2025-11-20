package microservicio.foro.config;

import microservicio.foro.model.Post;
import microservicio.foro.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public class DataSeeder implements CommandLineRunner {

    private final PostRepository postRepository;
        private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    public DataSeeder(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (postRepository.count() > 0) return; // ya hay datos

        List<Post> seeds = new ArrayList<>();

        seeds.add(Post.builder()
                .externalId("p2")
                .title("Central Look LOOKBOOK")
                .content("Sesión Central – perfil y streetwear.")
                .image("/IMG/central.jpg")
                .authorId("USUARIO_ASFALTO")
                .category("PERFIL")
                .createdAt("2025-10-18T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p3")
                .title("Kuroh Style LOOKBOOK")
                .content("Kuroh – colección callejera.")
                .image("/IMG/kuroh.jpg")
                .authorId("USUARIO_ASFALTO")
                .category("COLECCIONES")
                .createdAt("2025-10-15T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p4")
                .title("Kai Style LOOKBOOK")
                .content("Kai – street y pasarela.")
                .image("/IMG/kai.jpg")
                .authorId("USUARIO_ASFALTO")
                .category("DESFILES")
                .createdAt("2025-10-10T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p5")
                .title("Pablo Fashion LOOKBOOK")
                .content("Pablo – editorial urbano.")
                .image("/IMG/pablo.jpg")
                .authorId("ASFALTOSFASHION")
                .category("EDITORIAL")
                .createdAt("2025-10-05T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p6")
                .title("Lil Wey Fashion LOOKBOOK")
                .content("Lil Wey – estilo editorial.")
                .image("/IMG/lil wey.jpg")
                .authorId("ASFALTOSFASHION")
                .category("EDITORIAL")
                .createdAt("2025-09-28T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p7")
                .title("Nene Look LOOKBOOK")
                .content("Nene – perfil y street.")
                .image("/IMG/nene.jpg")
                .authorId("USUARIO_ASFALTO")
                .category("PERFIL")
                .createdAt("2025-09-25T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p8")
                .title("Louis Vuitton x Final Fantasy — Lookbook")
                .content("Louis Vuitton x FFXIV — colaboración editorial.")
                .image("/IMG/Louis-Vuitton-Final-Fantasy-Lightning-Square-Enix-2.webp")
                .authorId("LOUIS VUITTON")
                .category("COLECCIONES")
                .createdAt("2025-10-22T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p9")
                .title("Young Thug - Backstage Look")
                .content("Young Thug backstage — streetwear.")
                .image("/IMG/yun tug.jpg")
                .authorId("YUNGTHUG")
                .category("DESFILES")
                .createdAt("2025-10-21T00:00:00Z")
                .build());

        seeds.add(Post.builder()
                .externalId("p10")
                .title("VSA Collection — Street Editorial")
                .content("VSA — street editorial collection.")
                .image("/IMG/galegale.jpg")
                .authorId("VSA")
                .category("COLECCIONES")
                .createdAt("2025-10-19T00:00:00Z")
                .build());

        List<Post> saved = postRepository.saveAll(seeds);
        logger.info("DataSeeder: insertadas {} publicaciones de ejemplo.", saved.size());
    }
}
