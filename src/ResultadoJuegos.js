import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ResultadoJuegos() {
  const [juegos, setJuegos] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  let { busqueda } = useParams();

  const fetchJuegos = async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);

      setJuegos((prevJuegos) => {
        // Crear un set de IDs únicos para evitar duplicados
        const uniqueGames = new Map();

        // Agregar juegos existentes
        prevJuegos.forEach((game) => uniqueGames.set(game.id, game));

        // Agregar nuevos juegos
        response.data.results.forEach((game) =>
          uniqueGames.set(game.id, game)
        );

        return Array.from(uniqueGames.values());
      });

      setNextPage(response.data.next);
    } catch (error) {
      console.error("Error al obtener los juegos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reiniciar la lista de juegos y la paginación al cambiar la búsqueda
    setJuegos([]);
    setNextPage(null);

    const url = `https://api.rawg.io/api/games?key=0dd2baa63fcd40a8a56bf2171cf94563&search=${busqueda}`;
    fetchJuegos(url);
  }, [busqueda]);

  return (
    <div className="container">
      <hr />
      <h1>Resultados de búsqueda para: {busqueda}</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Plataforma</th>
            <th>Género</th>
            <th>Año</th>
            <th>Nota Metacritic</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {juegos.map((juego) => (
            <tr key={juego.id}>
              <td>{juego.name}</td>
              <td>
                {juego.platforms
                  ? juego.platforms
                      .map((p) => p.platform.name)
                      .join(", ")
                  : "N/A"}
              </td>
              <td>
                {juego.genres
                  ? juego.genres.map((g) => g.name).join(", ")
                  : "N/A"}
              </td>
              <td>{juego.released || "N/A"}</td>
              <td>{juego.metacritic || "N/A"}</td>
              <td>
                <Link to={`/detalle/${juego.id}`} className="btn btn-success">
                  Detalles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        {nextPage && (
          <button
            onClick={() => fetchJuegos(nextPage)}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar más juegos"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ResultadoJuegos;
