
/* =========================================
   CONFIGURACIÓN DE SPORTIX
========================================= */

// EmailJS: reemplaza estos tres valores por los de tu cuenta.
const EMAILJS_PUBLIC_KEY = "5HKOCq3FAqnVAjgcO";
const EMAILJS_SERVICE_ID = "service_29nroum";
const EMAILJS_TEMPLATE_ID = "template_ojkomnj";

// Discord: pega aquí la URL de tu webhook.
// Advertencia: una URL de webhook puesta en JavaScript
// queda visible para cualquier persona que visite la web.
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1558898171277607047/-P1JN77aPWSDkaJT-1vA9c5Ysctb-stbMxEnyBR7bbMU6IPfp9VkY0JvWCsfOH_Hq8Yv";


/* =========================================
   INICIALIZAR EMAILJS
========================================= */

if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });
}


/* =========================================
   MENÚ DE NAVEGACIÓN
========================================= */

function toggleMenu() {
    const navLinks = document.getElementById("navLinks");

    if (navLinks) {
        navLinks.classList.toggle("active");
    }
}


/* =========================================
   MODO OSCURO
========================================= */

function cambiarTema() {
    document.body.classList.toggle("dark-mode");

    const boton = document.getElementById("themeToggle");

    if (boton) {
        boton.textContent =
            document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    }
}


/* =========================================
   MÚSICA DE FONDO
========================================= */

function controlarMusica() {
    const musica = document.getElementById("musicaFondo");
    const boton = document.getElementById("musicToggle");

    if (!musica || !boton) return;

    if (musica.paused) {
        musica.volume = 0.25;

        musica.play()
            .then(() => {
                boton.innerHTML =
                    '<i class="fa-solid fa-pause"></i> 🔊';
                boton.title = "Pausar música";
            })
            .catch(() => {
                alert(
                    "No se pudo reproducir la música. " +
                    "Revisa que exista musica/fondo.mp3."
                );
            });
    } else {
        musica.pause();
        boton.innerHTML =
            '<i class="fa-solid fa-music"></i> 🔇';
        boton.title = "Reproducir música";
    }
}


/* =========================================
   BOTONES DE PRODUCTOS
========================================= */

function comprarProducto(nombre, precio) {
    alert("Has seleccionado " + nombre + " por " + precio);
}


/* =========================================
   CAMBIAR IDIOMA
========================================= */

function cambiarIdioma(idioma) {
    document.documentElement.lang = idioma;

    document.querySelectorAll("[data-es][data-en]").forEach(elemento => {
        elemento.textContent = elemento.getAttribute("data-" + idioma);
    });

    const botonES = document.getElementById("btn-es");
    const botonEN = document.getElementById("btn-en");

    if (botonES) botonES.classList.toggle("activo", idioma === "es");
    if (botonEN) botonEN.classList.toggle("activo", idioma === "en");

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const mensaje = document.getElementById("mensaje");

    if (nombre) {
        nombre.placeholder =
            idioma === "en" ? "Enter your name" : "Escribe tu nombre";
    }

    if (correo) {
        correo.placeholder =
            idioma === "en" ? "example@gmail.com" : "ejemplo@gmail.com";
    }

    if (mensaje) {
        mensaje.placeholder =
            idioma === "en" ? "Write your message..." : "Escribe tu mensaje...";
    }
}


/* =========================================
   ENVIAR MENSAJE A GMAIL Y DISCORD
========================================= */

async function enviarMensaje(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const nombreCampo = formulario.querySelector('[name="nombre"]');
    const correoCampo = formulario.querySelector('[name="correo"]');
    const mensajeCampo = formulario.querySelector('[name="mensaje"]');

    const resultado = formulario.querySelector("#mensajeExito");
    const boton = formulario.querySelector("#btnEnviar");

    if (!nombreCampo || !correoCampo || !mensajeCampo) {
        if (resultado) {
            resultado.textContent = "No se encontraron todos los campos del formulario.";
        }
        return;
    }

    const nombre = nombreCampo.value.trim();
    const correo = correoCampo.value.trim();
    const mensaje = mensajeCampo.value.trim();

    if (!nombre || !correo || !mensaje) {
        if (resultado) resultado.textContent = "Completa todos los campos.";
        return;
    }

    if (boton) {
        boton.disabled = true;
        boton.textContent = "Enviando...";
    }

    if (resultado) {
        resultado.textContent = "Enviando tu mensaje...";
    }

    const datos = {
        nombre: nombre,
        correo: correo,
        mensaje: mensaje
    };

    let gmailEnviado = false;
    let discordEnviado = false;

    // Enviar a Gmail mediante EmailJS.
    try {
        if (
            typeof emailjs !== "undefined" &&
            EMAILJS_PUBLIC_KEY !== "TU_PUBLIC_KEY" &&
            EMAILJS_SERVICE_ID !== "TU_SERVICE_ID" &&
            EMAILJS_TEMPLATE_ID !== "TU_TEMPLATE_ID"
        ) {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                datos
            );

            gmailEnviado = true;
        } else {
            console.warn("EmailJS no está configurado todavía.");
        }
    } catch (error) {
        console.error("Error enviando a Gmail:", error);
    }

    // Enviar a Discord mediante el webhook.
    try {
        if (
            DISCORD_WEBHOOK_URL !== "TU_DISCORD_WEBHOOK_URL" &&
            DISCORD_WEBHOOK_URL.startsWith("https://")
        ) {
            const respuesta = await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    embeds: [{
                        title: "Nuevo mensaje de SPORTIX",
                        color: 16167459,
                        fields: [
                            {
                                name: "Nombre",
                                value: nombre.slice(0, 1024)
                            },
                            {
                                name: "Correo",
                                value: correo.slice(0, 1024)
                            },
                            {
                                name: "Mensaje",
                                value: mensaje.slice(0, 1024)
                            }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });

            discordEnviado = respuesta.ok;

            if (!respuesta.ok) {
                console.error(
                    "Discord rechazó el mensaje:",
                    respuesta.status
                );
            }
        } else {
            console.warn("El webhook de Discord no está configurado.");
        }
    } catch (error) {
        console.error("Error enviando a Discord:", error);
    }

    // Mostrar el resultado real de los intentos.
    if (resultado) {
        if (gmailEnviado && discordEnviado) {
            resultado.textContent =
                "¡Mensaje enviado correctamente a Gmail y Discord!";
            formulario.reset();
        } else if (gmailEnviado) {
            resultado.textContent =
                "El mensaje llegó a Gmail, pero no se confirmó en Discord.";
            formulario.reset();
        } else if (discordEnviado) {
            resultado.textContent =
                "El mensaje llegó a Discord, pero no se confirmó en Gmail.";
            formulario.reset();
        } else {
            resultado.textContent =
                "No se pudo confirmar el envío. Revisa la configuración e inténtalo de nuevo.";
        }
    }

    if (boton) {
        boton.disabled = false;
        boton.innerHTML =
            '<i class="fa-brands fa-discord"></i> Enviar mensaje';
    }
}


/* =========================================
   FORMULARIO DE INDEX.HTML
========================================= */

// contacto.html ya llama a enviarMensaje(event) en su HTML.
// En index.html agregamos el evento aquí, evitando duplicarlo.
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("contactForm");

    if (
        formulario &&
        !formulario.hasAttribute("onsubmit")
    ) {
        formulario.addEventListener("submit", enviarMensaje);
    }
});


/* =========================================
   CARRUSEL DE PRODUCTOS
========================================= */

(function iniciarCarruselSPORTIX() {
    const track = document.getElementById("heroCarouselTrack");
    const carousel = document.getElementById("heroCarousel");
    const dots = Array.from(
        document.querySelectorAll(".hero-carousel-dot")
    );
    const prev = document.getElementById("carouselPrev");
    const next = document.getElementById("carouselNext");

    if (!track || !carousel || !dots.length || !prev || !next) {
        return;
    }

    let indiceActual = 0;
    let temporizador;
    const total = dots.length;

    function mostrarImagen(indice) {
        indiceActual = (indice + total) % total;
        track.style.transform =
            `translateX(-${indiceActual * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === indiceActual);
            dot.setAttribute(
                "aria-current",
                i === indiceActual ? "true" : "false"
            );
        });
    }

    function reiniciarTemporizador() {
        clearInterval(temporizador);
        temporizador = setInterval(() => {
            mostrarImagen(indiceActual + 1);
        }, 4000);
    }

    prev.addEventListener("click", () => {
        mostrarImagen(indiceActual - 1);
        reiniciarTemporizador();
    });

    next.addEventListener("click", () => {
        mostrarImagen(indiceActual + 1);
        reiniciarTemporizador();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            mostrarImagen(Number(dot.dataset.slide));
            reiniciarTemporizador();
        });
    });

    carousel.addEventListener("mouseenter", () => {
        clearInterval(temporizador);
    });

    carousel.addEventListener("mouseleave", reiniciarTemporizador);

    mostrarImagen(0);
    reiniciarTemporizador();
})();
