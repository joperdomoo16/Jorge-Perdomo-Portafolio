window["acciones del portal"] = {
    // carga inicial al abrir el sitio
    "iniciar portal": function () {
        window["acciones del portal"]["gestionar menu"]();
        window["acciones del portal"]["gestionar barra"]();
    },
    // cierra la lista de navegacion en telefonos al pulsar un enlace
    "gestionar menu": function () {
        const registros = {
            "enlaces de navegacion": document.querySelectorAll(".navbar-nav .nav-link"),
            "panel colapsable": document.getElementById("menu colapsable")
        };

        registros["enlaces de navegacion"].forEach(function (enlace) {
            enlace.addEventListener("click", function () {
                const panel = registros["panel colapsable"];
                if (panel && panel.classList.contains("show")) {
                    const colapso = bootstrap.Collapse.getInstance(panel) || new bootstrap.Collapse(panel);
                    colapso.hide();
                }
            });
        });
    },
    // aplica tono opaco a la barra superior al bajar en la vista
    "gestionar barra": function () {
        const barra = document.querySelector(".barra.navegacion");
        if (!barra) {
            return;
        }

        window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
                barra.style.background = "rgba(6, 12, 17, 0.98)";
                barra.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
            } else {
                barra.style.background = "rgba(6, 12, 17, 0.8)";
                barra.style.boxShadow = "none";
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", window["acciones del portal"]["iniciar portal"]);
