import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function DetalleJuego(){

    const [id_juego,setId] = useState("");
    const [titulo,setTitulo] = useState("");
    const [plataforma,setPlataforma] = useState("");
    const [genero,setGenero] = useState("");
    const [metacritic,setMetacritic] = useState("");
    const [ano,setAno] = useState("");
    const [img,setImg] = useState("");

    let {id} = useParams();

    const navigate = useNavigate(); //Para redireccionar

    useEffect(() => {
        cargarDatosJuego();
    },[]);

    //Se cargan los datos del juego por la id seleccionada
    const cargarDatosJuego = async () => {
        try {//
            const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=0dd2baa63fcd40a8a56bf2171cf94563`);
            const juego = response.data;
            setId(juego.id)
            setTitulo(juego.name)
            setPlataforma(juego.platforms
                ? juego.platforms.map((p) => p.platform.name).join(", ")
                : "N/A");
            setGenero(juego.genres
                ? juego.genres.map((g) => g.name).join(", ")
                : "N/A")
            setMetacritic(juego.metacritic)
            setAno(juego.released)
            setImg(juego.background_image)

        } catch (error) {
            console.log(error);
 
        }
    };

    return (
      //Se muestran datos del juego en formato card, con una imagen relacionada al inicio
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="card-header">
                <h5>{titulo}</h5>
            </div>
            {img && (
              <img
                src={img}
                className="card-img-top"
                alt={`Portada de ${titulo}`}
                style={{ maxHeight: "300px", objectFit: "cover", padding: "20px" }}
              />
            )}
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Plataforma:</strong> {plataforma}</li>
                <li className="list-group-item"><strong>Género:</strong> {genero}</li>
                <li className="list-group-item"><strong>Metacritic:</strong> {metacritic}</li>
                <li className="list-group-item"><strong>Año:</strong> {ano}</li>
              </ul>
            </div>
          </div>
        </div>
      );
      
}


export default DetalleJuego;