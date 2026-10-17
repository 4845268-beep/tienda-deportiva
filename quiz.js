
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const respuestas = {
        q1: "b",
        q2: "b",
        q3: "b",
        q4: "a",
        q5: "a",
        q6: "a",
        q7: "a",
        q8: "b",
        q9: "a",
        q10: "b"
    };

    let puntos = 0;
    let respondidas = 0;
    const total = Object.keys(respuestas).length;

    for (const pregunta in respuestas) {
        const seleccionada = document.querySelector(
            'input[name="' + pregunta + '"]:checked'
        );

        if (seleccionada) {
            respondidas++;

            if (seleccionada.value === respuestas[pregunta]) {
                puntos++;
            }
        }
    }

    if (respondidas < total) {
        alert("Responde las 10 preguntas antes de calificar.");
        return;
    }

    const porcentaje = Math.round((puntos / total) * 100);

    document.getElementById("score").textContent =
        "Tu puntuación: " + puntos + "/" + total + " (" + porcentaje + "%)";

    let mensaje;

    if (puntos === total) {
        mensaje = "¡Excelente! Respondiste correctamente todas las preguntas.";
    } else if (puntos >= 7) {
        mensaje = "¡Buen trabajo! Tienes buenos conocimientos de desarrollo web.";
    } else {
        mensaje = "Sigue practicando. Repasa las páginas de tecnologías e inténtalo nuevamente.";
    }

    document.getElementById("mensaje").textContent = mensaje;
    document.getElementById("resultado").style.display = "block";

    document.getElementById("resultado").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});
