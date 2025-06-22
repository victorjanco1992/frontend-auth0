
# Proyecto: 🖼️ Galería Segura - Frontend

Este proyecto es la interfaz de usuario de **Galería Segura**, una aplicación web que permite a usuarios autenticados visualizar imágenes y a administradores gestionar el contenido mediante permisos y roles definidos en Auth0.

---
Integrantes: Janco Victor, Castillo Albert

---

## ✅ Requisitos previos

Antes de ejecutar esta aplicación es necesario tener:

- [Node.js](https://nodejs.org/) instalado (versión 16+ recomendada)
- Una cuenta en [Auth0](https://auth0.com)
- Clonar el backend (https://github.com/victorjanco1992/backend-auth0)
- Backend corriendo en `http://localhost:8080`

---

## 🔐 Configuración requerida en Auth0

1. **Crear una cuenta en Auth0** (gratuita).
2. Crear una **Aplicación SPA**:
   - Obtené el `Domain` y `Client ID`.
   - Allowed Callback URLs:
     	http://localhost:3000, http://localhost:3000/callback
   - Allowed Logout URLs:
     	http://localhost:3000
     
   - Allowed Web Origins:
     	http://localhost:3000
   - Allowed Origins (CORS):
     	http://localhost:3000
   - Otras configuraciones: ✅ Activar la opción "Allow Cross-Origin Authentication".

3. Crear una **API** en Auth0:
   - Usar un **audience**  
   - Habilitar el flujo de acceso con tokens (JWT).
4. Crear **roles**:
   - `admin`
   - `user`
5. Asignar roles a usuarios desde el Dashboard de Auth0.
6. Crear una **Action post-login** con este código:

   ```js
   exports.onExecutePostLogin = async (event, api) => {
     const namespace = "https://galeria.example.com/";
     const roles = event.authorization.roles || [];
     api.accessToken.setCustomClaim(`${namespace}roles`, roles);
   };

⚙️ Variables de entorno

Creá un archivo .env en la raíz del proyecto frontend con el siguiente contenido:

	REACT_APP_AUTH0_DOMAIN=tu-dominio.auth0.com
	
	REACT_APP_AUTH0_CLIENT_ID=tu-client-id
	
	REACT_APP_AUTH0_AUDIENCE=tu-audience
	
	REACT_APP_API_BASE_URL=http://localhost:8080/api

🧪 **Instrucciones de instalación y ejecución**

1. Clonar el repositorio:

	git clone https://github.com/tu-usuario/galeria-segura-frontend.git

	cd galeria-segura-frontend

3. Instalar dependencias:

	npm install

4. Crear el archivo .env como se indicó arriba.

5. Iniciar la aplicación:

    npm start

    La app se ejecutará por defecto en http://localhost:3000.

💻 Tecnologías utilizadas

    React.js

    Auth0 React SDK (@auth0/auth0-react)

    Fetch API

    CSS personalizado

    JavaScript ES6+

🚧 Funcionalidades

    ✅ Inicio y cierre de sesión con Auth0

    🔐 Visualización de imágenes autenticado

    🛡️ Gestión de imágenes para administradores (eliminar/restaurar)

    🔍 Lógica de control basada en roles

    🧪 Prueba de endpoints públicos, protegidos y de administrador
