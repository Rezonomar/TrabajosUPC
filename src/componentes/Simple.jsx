import {db} from '/src/configuraciones/firebase.js'
import {ref, get} from 'firebase/database'
import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Simple(){

    const cvRef = useRef(null);

    const [objetivo, setObjetivo] = useState("");

    const [perfil, setPerfil] = useState("");
    const [educacion, setEducacion] = useState("");
    const [experiencia, setExperiencia] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [portafolio, setPortafolio] = useState("");

    const [proyectos, setProyectos] = useState([]);
    const [stack, setStack] = useState([]);
    const [aptitudes, setAptitudes] = useState([]);
    const [certificaciones, setCertificaciones] = useState([]);

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

                setProyectos(datos.proyectos ? Object.values(datos.proyectos) : []);
                setStack(datos.stack ? Object.values(datos.stack) : []);
                setAptitudes(datos.aptitudes ? Object.values(datos.aptitudes) : []);
                setCertificaciones(datos.certificaciones ? Object.values(datos.certificaciones) : []);
            }
        }
        cargarDatos();
    }, []);

    // genera una "captura" del div del CV y la mete en un PDF descargable
    async function descargarPDF(){
        const elemento = cvRef.current;

        const canvas = await html2canvas(elemento, {
            scale: 2,        // mayor resolucion, texto mas nitido
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const anchoPagina = pdf.internal.pageSize.getWidth();
        const altoPagina = pdf.internal.pageSize.getHeight();

        const anchoImagen = anchoPagina;
        const altoImagen = (canvas.height * anchoImagen) / canvas.width;

        // si el contenido es mas alto que una pagina A4, lo divide en varias paginas
        let alturaRestante = altoImagen;
        let posicionY = 0;

        pdf.addImage(imgData, 'PNG', 0, posicionY, anchoImagen, altoImagen);
        alturaRestante -= altoPagina;

        while (alturaRestante > 0) {
            posicionY = alturaRestante - altoImagen;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, posicionY, anchoImagen, altoImagen);
            alturaRestante -= altoPagina;
        }

        pdf.save('CV-Alexis-Quispe-Ramos.pdf');
    }

    return <>

        <style>{`
            .simple-cv {
                font-family: Georgia, 'Times New Roman', serif;
                color: #000;
                max-width: 800px;
                margin: 0 auto;
                padding: 32px 40px;
                line-height: 1.5;
            }
            .simple-cv h1 {
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                margin: 0;
            }
            .simple-cv h2 {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin: 2px 0 0;
            }
            .simple-cv .datos-contacto {
                text-align: center;
                font-size: 13px;
                margin: 4px 0 0;
            }
            .simple-cv .datos-contacto a {
                color: #1a0dab;
            }
            .simple-cv hr.regla {
                border: none;
                border-top: 2px solid #000;
                margin: 18px 0;
            }
            .simple-cv .seccion-titulo {
                font-weight: bold;
                font-size: 14.5px;
                margin: 0 0 6px;
            }
            .simple-cv .seccion-texto {
                font-size: 13.5px;
                text-align: justify;
                margin: 0 0 4px;
            }
            .simple-cv .fila-estudio {
                display: flex;
                gap: 14px;
                margin-bottom: 4px;
            }
            .simple-cv .fila-estudio .fecha {
                font-weight: bold;
                font-size: 13.5px;
                white-space: nowrap;
            }
            .simple-cv .fila-estudio .detalle {
                font-size: 13px;
            }
            .simple-cv .fila-estudio .detalle strong {
                display: block;
                font-size: 13.5px;
            }
            .simple-cv ul.lista-simple {
                margin: 0;
                padding-left: 20px;
                font-size: 13.5px;
            }
            .simple-cv ul.lista-simple li {
                margin-bottom: 2px;
            }
            .simple-cv .bloque {
                margin-bottom: 16px;
            }

            .btn-descarga {
                background: #10182B;
                color: #fff;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                display: block;
                margin: 20px auto;
            }
            .btn-descarga:hover {
                background: #1e2a4a;
            }

            .link-ver-mas {
                display: block;
                margin-top: 6px;
                font-family: 'IBM Plex Mono', monospace, Georgia;
                font-size: 13px;
                color: #10182B;
                text-decoration: none;
                border-bottom: 1px dashed #10182B;
                display: inline-block;
            }
            .link-ver-mas:hover {
                color: #5EEAD4;
                border-bottom-color: #5EEAD4;
            }

            /* al imprimir, se oculta el boton y se limpia el fondo */
            @media print {
                .no-print {
                    display: none !important;
                }
                body {
                    background: #fff;
                }
            }
        `}</style>

        <div className="no-print" style={{textAlign: 'center'}}>
            <button className="btn-descarga" onClick={descargarPDF}>
                Descargar como PDF
            </button>
            <a
                href="http://192.168.1.3:5173/"
                className="link-ver-mas"
            >
                Ver más →
            </a>
        </div>

        <div className="simple-cv" ref={cvRef}>

            <h1>Alexis Quispe Ramos</h1>
            <h2>UPC — INGENIERÍA DE SISTEMAS</h2>
            <p className="datos-contacto">
                Villa María del Triunfo, Lima, Perú<br/>
                Teléfono: 921514698<br/>
                <a href={`mailto:alexisquisperamos567@gmail.com`}>alexisquisperamos567@gmail.com</a>
                {github && <> · <a href={`https://${github}`} target="_blank" rel="noreferrer">{github}</a></>}
                {linkedin && <> · <a href={`https://${linkedin}`} target="_blank" rel="noreferrer">{linkedin}</a></>}
                {portafolio && <> · <a href={`https://${portafolio}`} target="_blank" rel="noreferrer">{portafolio}</a></>}
            </p>

            <hr className="regla" />

            {objetivo && (
                <div className="bloque">
                    <p className="seccion-titulo">Objetivo profesional:</p>
                    <p className="seccion-texto">{objetivo}</p>
                </div>
            )}

            <div className="bloque">
                <p className="seccion-titulo">Estudios:</p>
                <div className="fila-estudio">
                    <p className="detalle">
                        {educacion || "Aún no se registró la educación."}
                    </p>
                </div>
            </div>

            <div className="bloque">
                <p className="seccion-titulo">Experiencia:</p>
                <p className="seccion-texto">
                    {experiencia || "Aún no se registró experiencia."}
                </p>
            </div>

            <div className="bloque">
                <p className="seccion-titulo">Perfil profesional:</p>
                <p className="seccion-texto">
                    {perfil || "Aún no se registró el perfil profesional."}
                </p>
            </div>

            {proyectos.length > 0 && (
                <div className="bloque">
                    <p className="seccion-titulo">Proyectos:</p>
                    <ul className="lista-simple">
                        {proyectos.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bloque">
                <p className="seccion-titulo">Idiomas:</p>
                <p className="seccion-texto">
                    Español: lengua materna. Inglés: nivel intermedio.
                </p>
            </div>

            {stack.length > 0 && (
                <div className="bloque">
                    <p className="seccion-titulo">Stack técnico:</p>
                    <p className="seccion-texto">
                        {stack.join(", ")}
                    </p>
                </div>
            )}

            {aptitudes.length > 0 && (
                <div className="bloque">
                    <p className="seccion-titulo">Habilidades blandas:</p>
                    <ul className="lista-simple">
                        {aptitudes.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {certificaciones.length > 0 && (
                <div className="bloque">
                    <p className="seccion-titulo">Certificaciones:</p>
                    <ul className="lista-simple">
                        {certificaciones.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

        </div>

    </>
}

export default Simple;