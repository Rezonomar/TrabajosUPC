import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Principal from "./componentes/Principal.jsx";
import Menu from "./componentes/Menu.jsx";
import Login from "./componentes/Login.jsx";
import Escribir from "./componentes/Escribir.jsx";
import Simple from "./componentes/Simple.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Página principal */}
                <Route path="/" element={
                    <>
                        <Principal />
                    </>
                } />

                {/* Otras páginas */}
                <Route path="/login" element={<Login />} />
                <Route path="/reescribir" element={<Escribir />}/>
                <Route path="/simple" element={<Simple />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
