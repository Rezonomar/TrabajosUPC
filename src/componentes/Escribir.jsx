import '/src/Estilos/Principal.css';
import {db} from '/src/configuraciones/firebase.js'
import {ref, get, update, push, remove} from 'firebase/database'
import { useEffect, useState } from 'react';

// Hook reutilizable para las secciones tipo "lista" (proyectos, stack, aptitudes, certificaciones)
// Cada una necesita: cargar, agregar (push), eliminar la seleccionada (remove)
function useListaFirebase(nodo, setMensaje, setTipoMensaje){
    const [items, setItems] = useState([]);       // [{clave, valor}, ...]
    const [nuevo, setNuevo] = useState("");
    const [seleccionado, setSeleccionado] = useState(null);

    function cargar(datosNodo){
        if (datosNodo) {
            setItems(Object.entries(datosNodo).map(([clave, valor]) => ({ clave, valor })));
        }
    }

    function agregar(){
        if (!nuevo.trim()) return;
        push(ref(db, `datosCurriculum/${nodo}`), nuevo)
            .then((nuevaRef) => {
                setItems(prev => [...prev, { clave: nuevaRef.key, valor: nuevo }]);
                setNuevo("");
                setMensaje("¡Agregado correctamente!");
                setTipoMensaje("success");
            })
            .catch((error) => {
                setMensaje("Error: " + error.message);
                setTipoMensaje("danger");
            });
    }

    function eliminar(){
        if (!seleccionado) {
            setMensaje("Primero selecciona un ítem de la lista");
            setTipoMensaje("warning");
            return;
        }
        remove(ref(db, `datosCurriculum/${nodo}/${seleccionado}`))
            .then(() => {
                setItems(prev => prev.filter(item => item.clave !== seleccionado));
                setSeleccionado(null);
                setMensaje("Eliminado correctamente");
                setTipoMensaje("success");
            })
            .catch((error) => {
                setMensaje("Error al eliminar: " + error.message);
                setTipoMensaje("danger");
            });
    }

    return { items, nuevo, setNuevo, seleccionado, setSeleccionado, cargar, agregar, eliminar };
}

// Componente reutilizable para cada seccion tipo "lista" (proyectos, stack, aptitudes, certificaciones)
// 👇 declarado AFUERA de Escribir, a nivel del archivo, para que React no lo recree en cada render
function SeccionLista({ titulo, placeholder, data }) {
    return (
        <div>
            <p className="fw-bold" style={{fontSize: 'clamp(14px, 1.6vw, 19px)'}}>{titulo}</p>
            <div className="list-group">
                {data.items.map((item) => (
                    <button
                        key={item.clave}
                        className={`list-group-item list-group-item-action ${data.seleccionado === item.clave ? 'active' : ''}`}
                        onClick={() => data.setSeleccionado(item.clave)}
                    >
                        {item.valor}
                    </button>
                ))}
            </div>
            <div className="mt-2 d-flex flex-column">
                <div>
                    <button className="btn btn-danger mt-2" onClick={data.eliminar}>
                        Eliminar
                    </button>
                </div>
                <div className="mb-3 mt-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={placeholder}
                        value={data.nuevo}
                        onChange={(e) => data.setNuevo(e.target.value)}
                    />
                </div>
                <div>
                    <button className="btn btn-info mt-2" onClick={data.agregar}>
                        registrar
                    </button>
                </div>
            </div>
        </div>
    );
}

function Escribir(){
    // ---- campos de texto simple ----
    const [objetivo, setObjetivo] = useState("");
    const [perfil, setPerfil] = useState("");
    const [educacion, setEducacion] = useState("");
    const [experiencia, setExperiencia] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [portafolio, setPortafolio] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    // ---- secciones tipo lista ----
    const proyectos = useListaFirebase('proyectos', setMensaje, setTipoMensaje);
    const stack = useListaFirebase('stack', setMensaje, setTipoMensaje);
    const aptitudes = useListaFirebase('aptitudes', setMensaje, setTipoMensaje);
    const certificaciones = useListaFirebase('certificaciones', setMensaje, setTipoMensaje);

    useEffect(() => {
        async function cargarDatos() {
            const snapshot = await get(ref(db, 'datosCurriculum'));
            if (snapshot.exists()) {
                const datos = snapshot.val();
                setObjetivo(datos.objetivo || "");
                setPerfil(datos.perfil || "");
                setEducacion(datos.educacion || "");
                setExperiencia(datos.experiencia || "");
                setGithub(datos.github || "");
                setLinkedin(datos.linkedin || "");
                setPortafolio(datos.portafolio || "");

                proyectos.cargar(datos.proyectos);
                stack.cargar(datos.stack);
                aptitudes.cargar(datos.aptitudes);
                certificaciones.cargar(datos.certificaciones);
            }
        }
        cargarDatos();
    }, []);

    function guardarDatos(){
        update(ref(db, 'datosCurriculum'), {
            objetivo, perfil, educacion, experiencia, github, linkedin, portafolio
        }).then(() => {
            setMensaje("¡Datos guardados correctamente!");
            setTipoMensaje("success");
        })
            .catch((error) => {
                setMensaje("Error al guardar: " + error.message);
                setTipoMensaje("danger");
            });
    }

    return <>

        <div className="d-flex flex-column" style={{ height: '100vh', overflow: 'auto' }}>

            <div className="container-fluid text-center pt-3 pb-1" style={{background:"lightblue"}}>
                <p className="text-black" style={{fontSize: 'clamp(20px, 4vw, 40px)', fontWeight: 'bold'}}>
                    Alexis Quispe Ramos
                </p>
            </div>

            <div className="container-fluid p-3">

                <div>
                    <p className="fw-bold" style={{fontSize: 'clamp(14px, 1.6vw, 19px)'}}>OBJETIVO PROFESIONAL</p>
                    <div className="mb-3">
                        <label className="form-label">Una línea corta sobre lo que buscas</label>
                        <input type="text" className="form-control" placeholder="Ej: Estudiante de Ingeniería de Sistemas buscando práctica en Data Science" value={objetivo} onChange={(e) => setObjetivo(e.target.value)}/>
                    </div>
                </div>
                <hr className="border-black opacity-100" />

                <div>
                    <p className="fw-bold" style={{fontSize: 'clamp(14px, 1.6vw, 19px)'}}>PERFIL PROFESIONAL</p>
                    <div className="mb-3">
                        <label className="form-label">Perfil</label>
                        <input type="text" className="form-control" placeholder="Tu perfil" value={perfil} onChange={(e) => setPerfil(e.target.value)}/>
                    </div>
                </div>
                <hr className="border-black opacity-100" />

                <div>
                    <p className="fw-bold" style={{fontSize: 'clamp(14px, 1.6vw, 19px)'}}>EDUCACIÓN</p>
                    <div className="mb-3">
                        <label className="form-label">Institución, carrera y años</label>
                        <input type="text" className="form-control" placeholder="Ej: UPC — Ingeniería de Sistemas (2022 - actualidad)" value={educacion} onChange={(e) => setEducacion(e.target.value)}/>
                    </div>
                </div>
                <hr className="border-black opacity-100" />

                <div>
                    <p className="fw-bold" style={{fontSize: 'clamp(14px, 1.6vw, 19px)'}}>EXPERIENCIA</p>
                    <div className="mb-3">
                        <label className="form-label">Experiencia</label>
                        <input type="text" className="form-control" placeholder="Tu experiencia" value={experiencia} onChange={(e)=>setExperiencia(e.target.value)}/>
                    </div>
                </div>
                <hr className="border-black opacity-100" />

                <SeccionLista titulo="PROYECTOS" placeholder="Ej: Tesis — mBERT + BiLSTM para detección de insatisfacción" data={proyectos} />
                <hr className="border-black opacity-100" />

                <SeccionLista titulo="STACK TÉCNICO" placeholder="Ej: Firebase, React, SAP MM..." data={stack} />
                <hr className="border-black opacity-100" />

                <SeccionLista titulo="APTITUDES" placeholder="Nueva aptitud" data={aptitudes} />
                <hr className="border-black opacity-100" />

                <SeccionLista titulo="CERTIFICACIONES" placeholder="Nueva certificación" data={certificaciones} />
                <hr className="border-black opacity-100" />

                <div>
                    <p className="fw-bold" style={{fontSize: 'clamp(14px, 1.6vw, 19px)'}}>ENLACES</p>
                    <div className="mb-3">
                        <label className="form-label">GitHub</label>
                        <input type="text" className="form-control" placeholder="github.com/tu-usuario" value={github} onChange={(e) => setGithub(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">LinkedIn</label>
                        <input type="text" className="form-control" placeholder="linkedin.com/in/tu-usuario" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Portafolio</label>
                        <input type="text" className="form-control" placeholder="tu-portafolio.com" value={portafolio} onChange={(e) => setPortafolio(e.target.value)}/>
                    </div>
                </div>

                {mensaje && (
                    <div className={`alert alert-${tipoMensaje}`} role="alert">
                        {mensaje}
                    </div>
                )}

                <div className="container-fluid p-3">
                    <button className="btn btn-info" onClick={guardarDatos}>
                        Registrar información
                    </button>
                </div>

            </div>

        </div>
    </>
}

export default Escribir;