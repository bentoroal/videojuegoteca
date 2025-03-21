import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from "./TopBar";
import ListaJuegos from "./ListaJuegos";
import DetalleJuego from "./DetalleJuego";
import ResultadoJuegos from "./ResultadoJuegos";
import Header from "./Header";

// Esta es la app principal que contiene las rutas a otras paginas
function App() {
  return (
    <Router>
      <div>
        {/* //Todas las paginas contienen un header con logo y un nav bar que solo contiene un link al inicio */}
        <Header/>
        <TopBar/>
          <Routes> 
            {/* //Las rutas que llevan algun parametro para mostrar contenido van incluidas en las urls para ser usadas */}
            <Route path="/" element={<ListaJuegos/>} />
            <Route path='/detalle/:id' element={<DetalleJuego/>} />
            <Route path='/resultados/:busqueda' element={<ResultadoJuegos/>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
