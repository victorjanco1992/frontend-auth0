import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ImageGallery from "./components/ImageGallery";
import "./App.css";

const Home = () => {
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const [response, setResponse] = useState("");
  const [servidorActivo, setServidorActivo] = useState(true);

  const verificarServidor = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/public");
      return res.ok;
    } catch (error) {
      return false;
    }
  };

  const callEndpoint = async (url, requiresAuth = false, nombre = "") => {
    const backendOk = await verificarServidor();
    if (!backendOk) {
      setServidorActivo(false);
      setResponse(`No se pudo conectar al servidor. (Endpoint: ${nombre})`);
      return;
    }

    setServidorActivo(true);

    try {
      let headers = {};

      if (requiresAuth) {
        try {
          const token = await getAccessTokenSilently();
          headers.Authorization = `Bearer ${token}`;
        } catch (authError) {
          if (
            authError.error === "login_required" ||
            authError.error === "consent_required"
          ) {
            setResponse("Debes iniciar sesión para acceder a este endpoint.");
          } else {
            setResponse("Error de autenticación: " + authError.message);
          }
          return;
        }
      }

      const res = await fetch(url, { headers });

      if (res.ok) {
        const text = await res.text();
        setResponse(text);
      } else if (res.status === 401) {
        setResponse("No autorizado. Inicia sesión.");
      } else if (res.status === 403) {
        setResponse("Acceso denegado. No tienes permisos.");
      } else {
        setResponse("Error HTTP: " + res.status);
      }
    } catch (error) {
      setResponse("Error inesperado: " + error.message);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Galería Segura</h1>

      {!servidorActivo && (
        <div className="error-banner">
          El servidor no está disponible actualmente. Verifica que esté encendido.
        </div>
      )}

      <div className="auth-buttons">
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()} className="button primary">
            Iniciar sesión
          </button>
        ) : (
          <button onClick={() => logout({ returnTo: window.location.origin })} className="button secondary">
            Cerrar sesión
          </button>
        )}
      </div>

      <div className="endpoint-buttons">
        <button
          onClick={() => callEndpoint("http://localhost:8080/api/public", false, "público")}
          className="button success"
        >
          Endpoint Público
        </button>

        <button
          onClick={() => callEndpoint("http://localhost:8080/api/protected", true, "protegido")}
          className="button info"
        >
          Endpoint Protegido (Logueado)
        </button>

        <button
          onClick={() => callEndpoint("http://localhost:8080/api/admin", true, "admin")}
          className="button warning"
        >
          Endpoint Admin
        </button>
      </div>

      <div className="response-box">
        <strong>Respuesta:</strong>
        <p>{response}</p>
      </div>

      <ImageGallery servidorActivo={servidorActivo} setServidorActivo={setServidorActivo} />
    </div>
  );
};

export default Home;
