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
npm install --save-dev @testing-library/react@latest //NO OLVIDAR MI XAMXITOHERMOSO
```

Microservicio (desde `contacto`):
```powershell
cd contacto
.\mvnw.cmd -DskipTests package
.\mvnw.cmd spring-boot:run
# o: java -jar target\contacto-0.0.1-SNAPSHOT.jar
```


html, body, #root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #000; /* global black background */
}
