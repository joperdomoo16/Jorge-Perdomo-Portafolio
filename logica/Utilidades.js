/* Modulo de funciones auxiliares y utilidades del sistema */
(function () {
  'use strict';

  // Verifica si la persona solicito menos movimiento en su dispositivo
  function Movimientoreducido() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (Error) {
      return false;
    }
  }

  // Copia el correo al portapapeles con alternativa de respaldo
  function Copiartexto(Texto, Campo, Alcopiar) {
    var Exito = function () {
      if (typeof Alcopiar === 'function') Alcopiar(true);
    };

    var Respaldo = function () {
      try {
        if (!Campo) return;
        Campo.focus({ preventScroll: true });
        Campo.select();
        if (document.execCommand('copy')) Exito();
      } catch (Error) {}
    };

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(Texto).then(Exito, Respaldo);
      } else {
        Respaldo();
      }
    } catch (Error) {
      Respaldo();
    }
  }

  window.Utilidades = {
    Movimientoreducido: Movimientoreducido,
    Copiartexto: Copiartexto
  };
})();
