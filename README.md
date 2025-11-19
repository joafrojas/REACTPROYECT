# AFWEB

Proyecto monorepo que contiene:

- `AFWEB/`: frontend en React + Vite (TypeScript)
- `contacto/`: microservicio Spring Boot (Java)

Cómo ejecutar:

Frontend (desde `AFWEB`):
```powershell
cd AFWEB
npm install
npm run dev
```

Microservicio (desde `contacto`):
```powershell
cd contacto
.\mvnw.cmd -DskipTests package
.\mvnw.cmd spring-boot:run
# o: java -jar target\contacto-0.0.1-SNAPSHOT.jar
```

Notas:
- El microservicio está configurado para usar H2 en memoria en desarrollo.
- Revisa `contacto/src/main/resources/application.properties` antes de añadir credenciales reales.

Si necesitas que cambie algo en este README, dímelo.
