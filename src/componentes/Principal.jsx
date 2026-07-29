import '/src/Estilos/Principal.css'
import {db} from '/src/configuraciones/firebase.js'
import {ref, get} from 'firebase/database'
import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import iconoGmail from '../assets/brand-gmail.png';

function Principal() {

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

    // captura el div del CV y lo descarga como PDF, dividiendo en paginas si es necesario
    async function descargarPDF(){
        const elemento = cvRef.current;

        const canvas = await html2canvas(elemento, {
            scale: 2,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const anchoPagina = pdf.internal.pageSize.getWidth();
        const altoPagina = pdf.internal.pageSize.getHeight();

        const anchoImagen = anchoPagina;
        const altoImagen = (canvas.height * anchoImagen) / canvas.width;

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
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

            .cv-page {
                font-family: 'Inter', sans-serif;
                color: #1C2230;
                background: #F4F3EF;
            }

            .cv-header {
                background: #0E1526;
                position: relative;
                overflow: hidden;
                padding: 28px 24px 24px;
            }
            .cv-header::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image:
                    linear-gradient(rgba(94, 234, 212, 0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(94, 234, 212, 0.08) 1px, transparent 1px);
                background-size: 22px 22px;
            }
            .cv-header-inner {
                position: relative;
                z-index: 1;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: flex-end;
                gap: 12px;
            }
            .cv-name {
                font-family: 'Space Grotesk', sans-serif;
                font-weight: 700;
                color: #F4F3EF;
                font-size: clamp(24px, 4vw, 42px);
                letter-spacing: -0.01em;
                margin: 0;
            }
            .cv-role {
                font-family: 'IBM Plex Mono', monospace;
                color: #5EEAD4;
                font-size: clamp(11px, 1.3vw, 14px);
                letter-spacing: 0.14em;
                text-transform: uppercase;
                margin: 4px 0 0;
            }
            .cv-objetivo {
                font-family: 'Inter', sans-serif;
                color: #B7C0D4;
                font-size: clamp(11.5px, 1.2vw, 14px);
                max-width: 360px;
                margin: 0;
                line-height: 1.5;
            }

            .cv-links {
                display: flex;
                gap: 14px;
                flex-wrap: wrap;
                margin-top: 8px;
            }
            .cv-links span {
                font-family: 'IBM Plex Mono', monospace;
                font-size: clamp(10.5px, 1.1vw, 12.5px);
                color: #5EEAD4;
                border-bottom: 1px dashed rgba(94, 234, 212, 0.5);
                padding-bottom: 1px;
            }

            .cv-sidebar {
                background: #10182B;
                position: relative;
                overflow: hidden;
            }
            .cv-sidebar::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image:
                    linear-gradient(rgba(94, 234, 212, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(94, 234, 212, 0.05) 1px, transparent 1px);
                background-size: 20px 20px;
                pointer-events: none;
            }
            .cv-sidebar-content {
                position: relative;
                z-index: 1;
            }

            .cv-photo-ring {
                width: clamp(90px, 15vw, 150px);
                height: clamp(90px, 15vw, 150px);
                border-radius: 50%;
                padding: 4px;
                background: conic-gradient(from 180deg, #5EEAD4, #10182B 40%, #10182B 60%, #5EEAD4);
                margin: 0 auto;
            }
            .cv-photo-ring img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                display: block;
                border: 3px solid #10182B;
            }

            .cv-contact-row {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 6px 0;
            }
            .cv-contact-row img {
                width: 16px;
                height: 16px;
                opacity: 0.85;
                filter: invert(76%) sepia(37%) saturate(429%) hue-rotate(112deg) brightness(93%) contrast(89%);
            }
            .cv-contact-row p {
                font-family: 'IBM Plex Mono', monospace;
                font-size: clamp(10.5px, 1.15vw, 13px);
                color: #C9D2E3;
                margin: 0;
                word-break: break-word;
            }

            .cv-sidebar-label {
                font-family: 'IBM Plex Mono', monospace;
                font-weight: 500;
                font-size: clamp(11px, 1.2vw, 13px);
                letter-spacing: 0.12em;
                color: #5EEAD4;
                text-transform: uppercase;
                margin: 0 0 6px;
            }
            .cv-sidebar-text {
                font-size: clamp(11px, 1.2vw, 14px);
                color: #B7C0D4;
                line-height: 1.6;
                margin: 0;
            }

            .cv-divider {
                border: none;
                border-top: 1px dashed rgba(94, 234, 212, 0.35);
                margin: 18px 0;
            }
            .cv-divider-dark {
                border: none;
                border-top: 1px dashed rgba(28, 34, 48, 0.2);
                margin: 18px 0;
            }

            .cv-scale {
                position: relative;
                height: 6px;
                background: rgba(94, 234, 212, 0.15);
                border-radius: 3px;
                margin: 8px 0 4px;
                overflow: hidden;
            }
            .cv-scale-fill {
                height: 100%;
                background: #5EEAD4;
                border-radius: 3px;
            }

            .cv-section-label {
                display: flex;
                align-items: baseline;
                gap: 10px;
                margin-bottom: 8px;
            }
            .cv-section-label span {
                font-family: 'IBM Plex Mono', monospace;
                font-weight: 500;
                font-size: clamp(12px, 1.4vw, 15px);
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #10182B;
                white-space: nowrap;
            }
            .cv-section-label::after {
                content: "";
                flex: 1;
                border-top: 1px dashed rgba(28, 34, 48, 0.25);
            }

            .cv-section-text {
                font-size: clamp(12.5px, 1.3vw, 16px);
                line-height: 1.7;
                color: #3A4256;
                margin: 0;
            }
            .cv-section-text.empty {
                color: #9AA2B4;
                font-style: italic;
            }

            .cv-chip-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .cv-chip {
                font-family: 'IBM Plex Mono', monospace;
                font-size: clamp(11px, 1.15vw, 13px);
                color: #0E1526;
                background: #FFFFFF;
                border: 1px solid #10182B;
                border-radius: 3px;
                padding: 5px 10px;
                position: relative;
            }
            .cv-chip::before {
                content: "";
                width: 6px;
                height: 6px;
                background: #5EEAD4;
                border: 1px solid #10182B;
                border-radius: 50%;
                position: absolute;
                top: -4px;
                left: -4px;
            }

            .cv-chip-stack {
                font-family: 'IBM Plex Mono', monospace;
                font-size: clamp(11px, 1.15vw, 13px);
                color: #F4F3EF;
                background: #10182B;
                border-radius: 3px;
                padding: 5px 10px;
            }

            .cv-proyecto {
                border-left: 2px solid #5EEAD4;
                padding-left: 12px;
                margin-bottom: 12px;
            }
            .cv-proyecto p {
                margin: 0;
                font-size: clamp(12.5px, 1.3vw, 15px);
                color: #3A4256;
                line-height: 1.6;
            }

            /* PANTALLAS ANGOSTAS (celular en vertical): mantener las 2 columnas,
               pero encoger todo proporcionalmente en vez de apilar */
            @media (max-width: 768px) {
                .cv-sidebar {
                    flex: 0 0 clamp(90px, 30vw, 210px) !important;
                    max-width: clamp(90px, 30vw, 210px) !important;
                }
                .cv-sidebar.p-3 {
                    padding: 10px !important;
                }
                .cv-photo-ring {
                    width: clamp(50px, 18vw, 90px);
                    height: clamp(50px, 18vw, 90px);
                }
                .cv-contact-row img {
                    width: 12px;
                    height: 12px;
                }
                .cv-contact-row p {
                    font-size: clamp(8px, 2.2vw, 10.5px);
                }
                .cv-sidebar-label {
                    font-size: clamp(8.5px, 2.2vw, 11px);
                }
                .cv-sidebar-text {
                    font-size: clamp(8px, 2.1vw, 11px);
                }
                .cv-name {
                    font-size: clamp(17px, 5.5vw, 24px);
                }
                .cv-role {
                    font-size: clamp(8.5px, 2.3vw, 11px);
                }
                .cv-objetivo {
                    font-size: clamp(9px, 2.3vw, 11.5px);
                }
                .cv-section-label span {
                    font-size: clamp(9.5px, 2.5vw, 12px);
                }
                .cv-section-text {
                    font-size: clamp(9.5px, 2.4vw, 12.5px);
                }
                .cv-chip, .cv-chip-stack {
                    font-size: clamp(8.5px, 2.1vw, 11px);
                    padding: 3px 7px;
                }
                .cv-header {
                    padding: 14px 14px 12px;
                }
                .cv-divider, .cv-divider-dark {
                    margin: 10px 0;
                }
                .cv-links span {
                    font-size: clamp(7.5px, 2vw, 10px);
                }
                .cv-proyecto p {
                    font-size: clamp(9.5px, 2.4vw, 12.5px);
                }
                .cv-proyecto {
                    padding-left: 8px;
                    margin-bottom: 8px;
                }
                .cv-content {
                    padding: 12px !important;
                }
            }
        `}</style>

        <button
            onClick={descargarPDF}
            style={{
                position: 'fixed',
                top: '16px',
                right: '16px',
                zIndex: 10,
                background: '#5EEAD4',
                color: '#0E1526',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 18px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
            }}
        >
            Descargar PDF
        </button>

        <div className="cv-page d-flex flex-column" style={{ height: '100vh' }} ref={cvRef}>

            <div className="cv-header">
                <div className="cv-header-inner">
                    <div>
                        <p className="cv-name">Alexis Quispe Ramos</p>
                        <p className="cv-role">Ingeniería de Sistemas · UPC</p>
                        {objetivo && <p className="cv-objetivo">{objetivo}</p>}
                    </div>

                    {(github || linkedin || portafolio) && (
                        <div className="cv-links">
                            {github && <span>{github}</span>}
                            {linkedin && <span>{linkedin}</span>}
                            {portafolio && <span>{portafolio}</span>}
                        </div>
                    )}
                </div>
            </div>

            <div className="cv-body container-fluid d-flex flex-row p-0 flex-fill" style={{overflow: 'auto'}}>

                <div className="cv-sidebar p-3" style={{flex: '0 0 clamp(210px, 26vw, 280px)', maxWidth: 'clamp(210px, 26vw, 280px)'}}>
                    <div className="cv-sidebar-content">

                        <div className="cv-photo-ring">
                            <img src="/src/assets/Logo_Persona.png" alt="Foto de perfil" />
                        </div>

                        <div className="mt-4">
                            <div className="cv-contact-row">
                                <img src={iconoGmail} alt="" />
                                <p>alexisquisperamos567@gmail.com</p>
                            </div>
                            <div className="cv-contact-row">
                                <img src="/src/assets/phone-ringing (1).png" alt="" />
                                <p>921514698</p>
                            </div>
                            <div className="cv-contact-row">
                                <img src="/src/assets/current-location.png" alt="" />
                                <p>Villa María del Triunfo</p>
                            </div>
                        </div>

                        <hr className="cv-divider" />

                        <div>
                            <p className="cv-sidebar-label">Educación</p>
                            <p className="cv-sidebar-text">
                                {educacion || "Aún no se registró educación."}
                            </p>
                        </div>

                        <hr className="cv-divider" />

                        <div>
                            <p className="cv-sidebar-label">Habilidades blandas</p>
                            <p className="cv-sidebar-text">
                                Trabajo en equipo e investigación autónoma, con foco en resolver problemas de forma metódica.
                            </p>
                        </div>

                        <hr className="cv-divider" />

                        <div>
                            <p className="cv-sidebar-label">Idiomas</p>
                            <p className="cv-sidebar-text" style={{marginBottom: '10px'}}>Español — lengua materna</p>

                            <div className="d-flex flex-row justify-content-between">
                                <p className="cv-sidebar-text">Inglés</p>
                                <p className="cv-sidebar-text" style={{fontFamily: "'IBM Plex Mono', monospace"}}>60%</p>
                            </div>
                            <div className="cv-scale">
                                <div className="cv-scale-fill" style={{width: '60%'}}></div>
                            </div>
                            <p className="cv-sidebar-text" style={{opacity: 0.75, fontSize: '11px'}}>Nivel intermedio</p>
                        </div>

                        <hr className="cv-divider" />

                        <div>
                            <p className="cv-sidebar-label">Stack técnico</p>
                            {stack.length > 0 ? (
                                <div className="cv-chip-list">
                                    {stack.map((item, index) => (
                                        <span key={index} className="cv-chip-stack">{item}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="cv-sidebar-text" style={{fontStyle: 'italic', opacity: 0.7}}>
                                    Aún no se registró el stack técnico.
                                </p>
                            )}
                        </div>

                    </div>
                </div>

                <div className="cv-content p-4" style={{background: '#F4F3EF', flex: 1, minWidth: 0}}>

                    <div className="cv-section-label"><span>Perfil profesional</span></div>
                    <p className={`cv-section-text ${!perfil ? 'empty' : ''}`}>
                        {perfil || 'Aún no se registró el perfil profesional.'}
                    </p>

                    <hr className="cv-divider-dark" />

                    <div className="cv-section-label"><span>Experiencia</span></div>
                    <p className={`cv-section-text ${!experiencia ? 'empty' : ''}`}>
                        {experiencia || 'Aún no se registró experiencia.'}
                    </p>

                    <hr className="cv-divider-dark" />

                    <div className="cv-section-label"><span>Proyectos</span></div>
                    {proyectos.length > 0 ? (
                        <div>
                            {proyectos.map((item, index) => (
                                <div key={index} className="cv-proyecto">
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="cv-section-text empty">Aún no se registraron proyectos.</p>
                    )}

                    <hr className="cv-divider-dark" />

                    <div className="cv-section-label"><span>Aptitudes</span></div>
                    {aptitudes.length > 0 ? (
                        <div className="cv-chip-list">
                            {aptitudes.map((item, index) => (
                                <span key={index} className="cv-chip">{item}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="cv-section-text empty">Aún no se registraron aptitudes.</p>
                    )}

                    <hr className="cv-divider-dark" />

                    <div className="cv-section-label"><span>Certificaciones</span></div>
                    {certificaciones.length > 0 ? (
                        <div className="cv-chip-list">
                            {certificaciones.map((item, index) => (
                                <span key={index} className="cv-chip">{item}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="cv-section-text empty">Aún no se registraron certificaciones.</p>
                    )}

                </div>

            </div>

        </div>

    </>
}

export default Principal