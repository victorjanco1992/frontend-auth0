import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./ImageGallery.css";

const ImageGallery = ({ servidorActivo, setServidorActivo }) => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [images, setImages] = useState([]);

  const roles = Array.isArray(user?.["https://galeria.example.com/roles"])
    ? user["https://galeria.example.com/roles"]
    : [];

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!isAuthenticated) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });
        const res = await fetch(`${API_BASE}/images`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setImages(data);
          setServidorActivo(true);
        } else {
          console.error("Error al obtener imágenes");
          setServidorActivo(true);
          setImages([]);
        }
      } catch (error) {
        console.error("Error de red:", error);
        setServidorActivo(false); // ⚠️ backend no disponible
        setImages([]);
      }
    };

    fetchImages();
  }, [getAccessTokenSilently, isAuthenticated, API_BASE, setServidorActivo]);

  const obtenerToken = async () => {
    return await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    });
  };

  const eliminarImagen = async (id) => {
    try {
      const token = await obtenerToken();
      const res = await fetch(`${API_BASE}/images/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setImages(images.map(img =>
          img.id === id ? { ...img, deleted: true } : img
        ));
      } else {
        alert("No autorizado o error al eliminar");
      }
    } catch (error) {
      alert("Error al eliminar imagen");
      setServidorActivo(false);
    }
  };

  const restaurarImagen = async (id) => {
    try {
      const token = await obtenerToken();
      const res = await fetch(`${API_BASE}/images/${id}/restore`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setImages(images.map(img =>
          img.id === id ? { ...img, deleted: false } : img
        ));
      } else {
        alert("No autorizado o error al restaurar");
      }
    } catch (error) {
      alert("Error al restaurar imagen");
      setServidorActivo(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Por favor inicia sesión para ver las imágenes.</div>;
  }

  const isAdmin = roles.includes("admin");

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>
        {isAdmin ? "Panel de administración" : "Galería de imágenes"} - {user?.email}
      </h2>

      <div className="gallery">
        {images.length === 0 && <p className="no-images">No hay imágenes para mostrar.</p>}
        {images.map((img) => (
          <div key={img.id} className="card">
            {!img.deleted ? (
              <img src={img.url} alt={`Imagen ${img.id}`} />
            ) : (
              <div className="deleted-placeholder">Imagen no disponible (eliminada por el admin)</div>
            )}

            <div className="buttons">
              {!img.deleted && isAdmin && (
                <button onClick={() => eliminarImagen(img.id)} className="btn btn-delete">Eliminar</button>
              )}
              {img.deleted && isAdmin && (
                <button onClick={() => restaurarImagen(img.id)} className="btn btn-restore">Restaurar</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
