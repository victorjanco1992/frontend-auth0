import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ImageGallery from "./components/ImageGallery";
import "./App.css"; // 👈 Importa el CSS

const Home = () => {
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();
  const [response, setResponse] = useState("");

  const callEndpoint = async (url, requiresAuth = false) => {
    try {
      let headers = {};
      if (requiresAuth) {
        const token = await getAccessTokenSilently();
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(url, { headers });
      if (res.ok) {
        const text = await res.text();
        setResponse(text);
      } else if (res.status === 401) {
        setResponse("No autorizado. Por favor inicia sesión.");
      } else if (res.status === 403) {
        setResponse("Acceso denegado. No cuentas con los permisos necesarios para ver este endpoint.");
      } else {
        setResponse("Error: " + res.status);
      }
    } catch (e) {
      setResponse("Error al llamar al endpoint: " + e.message);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Galería Segura</h1>

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
        <button onClick={() => callEndpoint("http://localhost:8080/api/public", false)} className="button success">
          Endpoint Público
        </button>

        <button onClick={() => callEndpoint("http://localhost:8080/api/protected", true)} className="button info">
          Endpoint Usuario (Logueado)
        </button>

        <button onClick={() => callEndpoint("http://localhost:8080/api/admin", true)} className="button warning">
          Endpoint Admin
        </button>
      </div>

      <div className="response-box">
        <strong>Respuesta:</strong>
        <p>{response}</p>
      </div>

      <ImageGallery />
    </div>
  );
};

export default Home;
