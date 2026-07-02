# AutoCredit Frontend

Aplicación Next.js 16 + TypeScript para simular y administrar créditos vehiculares Compra Inteligente.

## Desarrollo local

Con el backend disponible en `http://localhost:8080`:

```bash
cp .env.example .env.local
npm install
npm run dev
```

La sesión JWT se guarda exclusivamente en una cookie `httpOnly` mediante el BFF de Next.js.

## Verificación

```bash
npm run lint
npm run build
```

## Aplicación completa

Desde `autocredit_back`:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Administrador: `admin@autocredit.pe` / `Admin123!`

Cambie las credenciales y secretos antes de cualquier despliegue real.
