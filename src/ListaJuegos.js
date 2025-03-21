import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ListaJuegos() {
  //Constantes para almacenar y setear valores
  const [juegos, setJuegos] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState(""); // 
  // Estados para los filtros y listas predefinidas
  const [filters, setFilters] = useState({
    year: "",
    genre: "",
    platform: "",
    tag: "",
    developer: "",
  });
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [tags, setTags] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const years = Array.from(
    { length: new Date().getFullYear() - 1950 + 1 },
    (_, i) => 1950 + i
  ); // Años desde 1950 hasta el actual

  // Función para obtener las listas predefinidas de filtros de la API de Rawg
  const fetchLists = async () => {
    try {
      const [genresRes, platformsRes, tagsRes, developersRes] =
        await Promise.all([
          axios.get(
            "https://api.rawg.io/api/genres?key=0dd2baa63fcd40a8a56bf2171cf94563"
          ),
          axios.get(
            "https://api.rawg.io/api/platforms?key=0dd2baa63fcd40a8a56bf2171cf94563"
          ),
          axios.get(
            "https://api.rawg.io/api/tags?key=0dd2baa63fcd40a8a56bf2171cf94563"
          ),
          axios.get(
            "https://api.rawg.io/api/developers?key=0dd2baa63fcd40a8a56bf2171cf94563"
          ),
        ]);
      setGenres(genresRes.data.results);
      setPlatforms(platformsRes.data.results);
      setTags(tagsRes.data.results);
      setDevelopers(developersRes.data.results);
    } catch (error) {
      console.error("Error al cargar las listas de filtros:", error);
    }
  };

  useEffect(() => {
    fetchLists(); // Carga inicial de las listas
  }, []);

  const fetchJuegos = async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);

      setJuegos((prevJuegos) => {
        // Crear un set de IDs únicos
        const uniqueGames = new Map();

        // Agregar juegos anteriores
        prevJuegos.forEach((game) => uniqueGames.set(game.id, game));

        // Agregar nuevos juegos evitando duplicados
        response.data.results.forEach((game) => uniqueGames.set(game.id, game));

        return Array.from(uniqueGames.values());
      });

      setNextPage(response.data.next);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJuegos(
      `https://api.rawg.io/api/games?key=0dd2baa63fcd40a8a56bf2171cf94563&ordering=-metacritic`
    );
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = async () => {
    const { year, genre, platform, tag, developer } = filters;
    let url = `https://api.rawg.io/api/games?key=0dd2baa63fcd40a8a56bf2171cf94563`;

    const params = [];

    if (year) params.push(`dates=${year}-01-01,${year}-12-31`);
    if (genre) params.push(`genres=${genre}`);
    if (platform) params.push(`platforms=${platform}`);
    if (tag) params.push(`tags=${tag}`);
    if (developer) params.push(`developers=${developer}`);

    if (params.length) {
      url += `&${params.join("&")}`;
    }

    setJuegos([]); // Asegurar que la lista se vacíe antes de aplicar filtros
    setNextPage(null); // Reiniciar paginación
    fetchJuegos(url);
  };

  return (
    <div className="container">
      <hr />
      <div className="filters">
        {/* //Filtros */}
        <div style={{ margin: "10px" }}>
          <label>Año :</label>
          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">Todos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div style={{ margin: "10px" }}>
          <label>Género :</label>
          <select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">Todos</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.slug}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ margin: "10px" }}>
          <label>Plataforma :</label>
          <select
            name="platform"
            value={filters.platform}
            onChange={handleFilterChange}
          >
            <option value="">Todas</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ margin: "10px" }}>
          <label>Tags :</label>
          <select name="tag" value={filters.tag} onChange={handleFilterChange}>
            <option value="">Todos</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ margin: "10px" }}>
          <label>Desarrollador :</label>
          <select
            name="developer"
            value={filters.developer}
            onChange={handleFilterChange}
          >
            <option value="">Todos</option>
            {developers.map((developer) => (
              <option key={developer.id} value={developer.slug}>
                {developer.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={applyFilters}
          className="btn btn-primary"
          style={{ margin: "10px" }}
        >
          Aplicar Filtros
        </button>
        <hr />
      </div>
      {/* Barra de  búsqueda */}
      <br />
      <div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
      <input
        type="text"
        placeholder="Buscar juego por nombre..."
        style={{width: "50%", padding: "10px" }} //
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <Link
        //Al presionar boton se redirige a la url que hace la busqueda de juegos a traves de la api
        to={`/resultados/${busqueda}`}
        className="btn btn-success"
        style={{ marginLeft: "10px" }} // Agrega espacio entre el input y el botón
      >
        Buscar
      </Link>
    </div>
      <h1>Lista de Juegos</h1>
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
              {/* //En caso de atributos que contienen mas de un valor, se hace un join para mostrarlos juntos, separados de coma */}
              <td>
                {juego.platforms
                  ? juego.platforms.map((p) => p.platform.name).join(", ")
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

export default ListaJuegos;
