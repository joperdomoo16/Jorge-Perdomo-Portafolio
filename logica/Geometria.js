/* Modulo de calculos geometricos y curvas matematicas */
(function () {
  'use strict';

  // Curva suave que pasa por varios puntos (Catmull-Rom), muestreada en varios puntos
  function Curva(Puntos, Muestras) {
    var Salida = [];
    var Total = Puntos.length - 1;
    var Tramo, Paso, T, Tcuadrado, Tcubo, Acumulado, Indice;

    for (Tramo = 0; Tramo < Total; Tramo += 1) {
      var Puntocero = Puntos[Math.max(0, Tramo - 1)];
      var Puntouno = Puntos[Tramo];
      var Puntodos = Puntos[Tramo + 1];
      var Puntotres = Puntos[Math.min(Total, Tramo + 2)];

      for (Paso = 0; Paso < Muestras; Paso += 1) {
        T = Paso / Muestras;
        Tcuadrado = T * T;
        Tcubo = Tcuadrado * T;

        Salida.push({
          x: 0.5 * ((2 * Puntouno.x) + (-Puntocero.x + Puntodos.x) * T + (2 * Puntocero.x - 5 * Puntouno.x + 4 * Puntodos.x - Puntotres.x) * Tcuadrado + (-Puntocero.x + 3 * Puntouno.x - 3 * Puntodos.x + Puntotres.x) * Tcubo),
          y: 0.5 * ((2 * Puntouno.y) + (-Puntocero.y + Puntodos.y) * T + (2 * Puntocero.y - 5 * Puntouno.y + 4 * Puntodos.y - Puntotres.y) * Tcuadrado + (-Puntocero.y + 3 * Puntouno.y - 3 * Puntodos.y + Puntotres.y) * Tcubo)
        });
      }
    }

    Salida.push({ x: Puntos[Total].x, y: Puntos[Total].y });
    Acumulado = 0;
    Salida[0].s = 0;

    for (Indice = 1; Indice < Salida.length; Indice += 1) {
      Acumulado += Math.hypot(Salida[Indice].x - Salida[Indice - 1].x, Salida[Indice].y - Salida[Indice - 1].y);
      Salida[Indice].s = Acumulado;
    }

    return Salida;
  }

  // Curva de Bezier cubica
  function Bezier(Puntoa, Puntob, Puntoc, Puntod, Muestras) {
    var Salida = [];
    var Acumulado = 0;
    var Indice, T, U, Punto;

    for (Indice = 0; Indice <= Muestras; Indice += 1) {
      T = Indice / Muestras;
      U = 1 - T;
      Punto = {
        x: U * U * U * Puntoa.x + 3 * U * U * T * Puntob.x + 3 * U * T * T * Puntoc.x + T * T * T * Puntod.x,
        y: U * U * U * Puntoa.y + 3 * U * U * T * Puntob.y + 3 * U * T * T * Puntoc.y + T * T * T * Puntod.y
      };

      if (Indice > 0) Acumulado += Math.hypot(Punto.x - Salida[Indice - 1].x, Punto.y - Salida[Indice - 1].y);
      Punto.s = Acumulado;
      Salida.push(Punto);
    }

    return Salida;
  }

  // Cable en espiral alrededor de una linea guia
  function Espiral(Guia, Vueltas, Radio, Corrimiento) {
    var Largo = Guia[Guia.length - 1].s || 1;
    var Muestras = Math.max(60, Math.round(Vueltas * 11));
    var Tramo = 1;
    var Texto = '';
    var Indice, S, Puntoa, Puntob, Fraccion, X, Y, Dx, Dy, Norma, Tx, Ty, Nx, Ny, T, Envolvente, Fase, R, Px, Py;

    for (Indice = 0; Indice <= Muestras; Indice += 1) {
      S = (Indice / Muestras) * Largo;
      while (Tramo < Guia.length - 1 && Guia[Tramo].s < S) Tramo += 1;

      Puntoa = Guia[Tramo - 1];
      Puntob = Guia[Tramo];
      Fraccion = (S - Puntoa.s) / Math.max(1e-6, Puntob.s - Puntoa.s);

      X = Puntoa.x + (Puntob.x - Puntoa.x) * Fraccion;
      Y = Puntoa.y + (Puntob.y - Puntoa.y) * Fraccion;
      Dx = Puntob.x - Puntoa.x;
      Dy = Puntob.y - Puntoa.y;
      Norma = Math.hypot(Dx, Dy) || 1;

      Tx = Dx / Norma;
      Ty = Dy / Norma;
      Nx = -Ty;
      Ny = Tx;

      T = Indice / Muestras;
      Envolvente = Math.min(1, T / 0.035, (1 - T) / 0.035);
      Fase = Math.PI * 2 * Vueltas * T;
      R = Radio * Envolvente;

      Px = X + Nx * R * Math.sin(Fase) + Tx * R * 0.6 * Math.cos(Fase) + (Corrimiento || 0);
      Py = Y + Ny * R * Math.sin(Fase) + Ty * R * 0.6 * Math.cos(Fase) + (Corrimiento || 0);

      Texto += (Indice === 0 ? 'M' : 'L') + Px.toFixed(1) + ',' + Py.toFixed(1);
    }

    return Texto;
  }

  window.Geometria = {
    Curva: Curva,
    Bezier: Bezier,
    Espiral: Espiral
  };
})();
