
/* ========================================
   SPORTIX - JAVASCRIPT
======================================== */

/* WEBHOOK DE DISCORD */
const webhookURL = "https://discord.com/api/webhooks/1558898171277607047/-P1JN77aPWSDkaJT-1vA9c5Ysctb-stbMxEnyBR7bbMU6IPfp9VkY0JvWCsfOH_Hq8Yv";

/* MENÚ RESPONSIVE */
function toggleMenu() {
    const menu = document.getElementById("navLinks");
    if (menu) {
        menu.classList.toggle("active");
    }
}

/* CAMBIAR TEMA */
function cambiarTema() {
    document.body.classList.toggle("dark-mode");

    const boton = document.getElementById("themeToggle");

    if (boton) {
        boton.textContent = document.body.classList.contains("dark-mode")
            ? "☀️"
            : "🌙";
    }
}

/* BOTÓN COMPRAR */
function comprarProducto() {
    alert(
        "¡Excelente elección!\n\n" +
        "Has seleccionado SPORTIX PRO RUNNER.\n" +
        "Precio: $69.99"
    );
}

/* MOSTRAR ESTADO DEL FORMULARIO */
function mostrarEstado(elemento, texto, color) {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.style.color = color;
}

/* LIMITAR TEXTO */
function limitarTexto(texto, maximo) {
    const limpio = texto.trim();
    return limpio.length > maximo
        ? limpio.substring(0, maximo)
        : limpio;
}

/* ENVIAR MENSAJE A DISCORD */
async function enviarMensaje(event) {
    event.preventDefault();

    const formulario = document.getElementById("contactForm");
    const campoNombre = document.getElementById("nombre");
    const campoCorreo = document.getElementById("correo");
    const campoMensaje = document.getElementById("mensaje");
    const mensajeEstado = document.getElementById("mensajeExito");
    const boton = document.getElementById("btnEnviar");

    if (!formulario || !campoNombre || !campoCorreo ||
        !campoMensaje || !mensajeEstado || !boton) {
        console.error("No se encontraron los campos del formulario.");
        return;
    }

    const nombre = campoNombre.value.trim();
    const correo = campoCorreo.value.trim();
    const mensaje = campoMensaje.value.trim();

    if (!nombre || !correo || !mensaje) {
        mostrarEstado(
            mensajeEstado,
            "Completa todos los campos.",
            "#ff4444"
        );
        return;
    }

    /* Validar correo */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarEstado(
            mensajeEstado,
            "Escribe un correo electrónico válido.",
            "#ff4444"
        );
        return;
    }

    /* Verificar que se haya configurado el webhook */
    if (
        !webhookURL.startsWith("https://discord.com/api/webhooks/") ||
        webhookURL.includes("PEGA_AQUI")
    ) {
        mostrarEstado(
            mensajeEstado,
            "Falta configurar la URL del webhook en script.js.",
            "#ff4444"
        );
        return;
    }

    const datos = {
        username: "SPORTIX - Contacto",
        embeds: [{
            title: "Nuevo mensaje de contacto",
            color: 16150528,
            fields: [
                {
                    name: "Nombre",
                    value: limitarTexto(nombre, 100),
                    inline: true
                },
                {
                    name: "Correo electrónico",
                    value: limitarTexto(correo, 200),
                    inline: true
                },
                {
                    name: "Mensaje",
                    value: limitarTexto(mensaje, 1500),
                    inline: false
                }
            ],
            footer: {
                text: "SPORTIX | Formulario de contacto"
            },
            timestamp: new Date().toISOString()
        }]
    };

    boton.disabled = true;
    mostrarEstado(
        mensajeEstado,
        "Enviando mensaje a Discord...",
        "#ff8c00"
    );

    try {
        const respuesta = await fetch(webhookURL + "?wait=true", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const detalle = await respuesta.text();
            console.error(
                "Error de Discord:",
                respuesta.status,
                detalle
            );

            mostrarEstado(
                mensajeEstado,
                "Discord rechazó el mensaje (HTTP " +
                    respuesta.status +
                    "). Revisa el webhook.",
                "#ff4444"
            );
            return;
        }

        mostrarEstado(
            mensajeEstado,
            "¡Mensaje enviado! Revisa el canal de Discord.",
            "#00a854"
        );

        formulario.reset();

    } catch (error) {
        console.error("Error de conexión:", error);

        mostrarEstado(
            mensajeEstado,
            "No se pudo conectar con Discord. Prueba con Live Server y revisa la consola.",
            "#ff4444"
        );
    } finally {
        boton.disabled = false;
    }
}

/* INICIAR FUNCIONES CUANDO CARGUE LA PÁGINA */
document.addEventListener("DOMContentLoaded", function () {
    console.log("SPORTIX cargado correctamente.");

    /* Conectar el formulario */
    const formulario = document.getElementById("contactForm");

    if (formulario) {
        formulario.addEventListener("submit", enviarMensaje);
    }

    /* Cerrar menú al seleccionar un enlace */
    const enlacesMenu = document.querySelectorAll(".nav-links a");
    const menu = document.getElementById("navLinks");

    enlacesMenu.forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            if (menu) menu.classList.remove("active");
        });
    });

    /* Animación de botones */
    const botones = document.querySelectorAll(".btn-primary");

    botones.forEach(function (boton) {
        boton.addEventListener("mouseenter", function () {
            boton.style.transform = "translateY(-3px)";
        });

        boton.addEventListener("mouseleave", function () {
            boton.style.transform = "translateY(0)";
        });
    });

    /* Navegación suave para enlaces de la misma página */
    const enlacesInternos = document.querySelectorAll('a[href^="#"]');

    enlacesInternos.forEach(function (enlace) {
        enlace.addEventListener("click", function (event) {
            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") return;

            const elemento = document.querySelector(destino);

            if (elemento) {
                event.preventDefault();
                elemento.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* Animación de tarjetas de productos */
    const productos = document.querySelectorAll(".producto-card");

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.style.opacity = "1";
                    entrada.target.style.transform = "translateY(0)";
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        productos.forEach(function (producto) {
            producto.style.opacity = "0";
            producto.style.transform = "translateY(30px)";
            producto.style.transition = "all 0.6s ease";
            observador.observe(producto);
        });
    }
});
