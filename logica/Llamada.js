/* Portafolio de Jorge David Perdomo
   Módulo de la llamada telefónica y contacto: física cinemática del cable espiralado y cámara
*/
(function () {
  'use strict';

  window.MetodosLlamada = {
    Mostrarcontacto(Evento) {
      const Estado = this.Estado || {};
      if (Estado.Contacto) return;
      let Origen = null;
      try {
        const Objetivo = Evento && Evento.currentTarget ? Evento.currentTarget : this.Botoncontacto;
        if (Objetivo) {
          const Caja = Objetivo.getBoundingClientRect();
          const Aro = Objetivo.querySelector('.Aro');
          const Cajaaro = Aro ? Aro.getBoundingClientRect() : Caja;
          Origen = { X: Cajaaro.left + Cajaaro.width / 2, Y: Cajaaro.top + Cajaaro.height / 2 };
        }
      } catch (Error) {}
      if (!Origen) Origen = { X: window.innerWidth - 80, Y: 38 };
      this.Botonorigen = Evento && Evento.currentTarget ? Evento.currentTarget : this.Botoncontacto;
      this.Llamada = null;
      this.Fijarestado({ Contacto: 'Abre', Textosllamada: false, Origenx: Math.round(Origen.X), Origeny: Math.round(Origen.Y), Menuabierto: false });
    },

    Ocultarcontacto() {
      if (!this.Estado || !this.Estado.Contacto || this.Estado.Contacto === 'Cierra') return;
      if (this.Cuadrollamada) { cancelAnimationFrame(this.Cuadrollamada); this.Cuadrollamada = null; }
      const Devolverfoco = () => {
        try { if (this.Botonorigen) this.Botonorigen.focus({ preventScroll: true }); } catch (Error) {}
      };
      if (this.Movimientoreducido()) { this.Fijarestado({ Contacto: '' }); Devolverfoco(); return; }
      this.Fijarestado({ Contacto: 'Cierra' });
      this.Esperar(580, () => { this.Fijarestado({ Contacto: '' }); Devolverfoco(); });
    },

    Iniciarllamada(Final) {
      const N = this.Nodosllamada;
      if (!N.Mundo || !N.Escena || !N.Grupo || !N.Cablelargo || !N.Svglargo) return;
      const Ancho = window.innerWidth;
      const Alto = window.innerHeight;
      const Proporcion = Ancho / Alto;
      const Apaisado = Proporcion >= 1.15;
      const Ancha = Proporcion > 1.95;
      let Anchoescena = Ancho * 1.75;
      let Izquierda = 0;
      if (Ancha) {
        Anchoescena = Alto * 1.04 * 1076 / 620;
        Izquierda = -0.03 * Anchoescena;
      } else if (Apaisado) {
        Anchoescena = Math.max(Ancho, Alto * 1076 / 620);
        Izquierda = (Ancho - Anchoescena) / 2;
      } else {
        Izquierda = (Ancho - Anchoescena) / 2 + Ancho * 0.07;
      }
      const Altoescena = Anchoescena * 620 / 1076;
      const Arriba = Alto * 3 - Altoescena;
      const K = Anchoescena / 1076;
      if (N.Textos) N.Textos.style.setProperty('--Bloqueizquierda', Ancha ? Math.round(Izquierda + Anchoescena * 0.72 + 24) + 'px' : '51%');
      N.Mundo.style.width = Ancho + 'px';
      N.Mundo.style.height = (Alto * 3) + 'px';
      N.Svglargo.setAttribute('viewBox', '0 0 ' + Ancho + ' ' + (Alto * 3));
      N.Svglargo.setAttribute('width', String(Ancho));
      N.Svglargo.setAttribute('height', String(Alto * 3));
      N.Escena.style.left = Izquierda + 'px';
      N.Escena.style.top = Arriba + 'px';
      N.Escena.style.width = Anchoescena + 'px';
      N.Escena.style.height = Altoescena + 'px';
      const Punto = (X, Y) => ({ x: Izquierda + X * K, y: Arriba + Y * K });
      const Estado = this.Estado || {};
      const Inicio = { x: Estado.Origenx || Ancho - 80, y: Estado.Origeny || 38 };
      const Destinocable = Punto(706, 600);
      const Guia = window.Geometria.Curva([Inicio, { x: Ancho * 0.8, y: Alto * 0.72 }, { x: Ancho * 0.22, y: Alto * 1.45 }, { x: Ancho * 0.74, y: Alto * 2.2 }, { x: Destinocable.x + 40 * K, y: Destinocable.y - 140 * K }, Destinocable], 90);
      const Radio = Math.max(4.5, 7.5 * K);
      const Largo = Guia[Guia.length - 1].s;
      const Vueltas = Largo / (Radio * 1.9);
      N.Cablelargo.setAttribute('d', window.Geometria.Espiral(Guia, Vueltas, Radio, 0));
      N.Cablelargobrillo.setAttribute('d', window.Geometria.Espiral(Guia, Vueltas, Radio, -Math.max(0.8, 1.1 * K)));
      N.Cablelargo.setAttribute('stroke-width', String(Math.max(2.6, 4.2 * K)));
      N.Cablelargobrillo.setAttribute('stroke-width', String(Math.max(0.9, 1.3 * K)));
      let Longitud = 1;
      try { Longitud = N.Cablelargo.getTotalLength(); } catch (Error) {}
      [N.Cablelargo, N.Cablelargobrillo].forEach((Camino) => {
        Camino.style.strokeDasharray = Longitud + ' ' + Longitud;
        Camino.style.strokeDashoffset = String(Longitud);
      });

      const Zoomfoco = Apaisado ? 1.6 : 2.0;
      const Mediaaltura = (Alto / 2) / (Zoomfoco * K);
      const Focoy = Math.min(Apaisado ? 424 : 400, 620 - Mediaaltura);
      this.Llamada = {
        Ancho: Ancho, Alto: Alto, K: K, Guia: Guia, Longitud: Longitud,
        Foco: Punto(521, Focoy), Zoomfoco: Zoomfoco,
        Centrofinal: { x: Ancho / 2, y: Alto * 2.5 },
        Inicio: null
      };

      if (Final || this.Movimientoreducido() || (this.Estado && this.Estado.Contacto === 'Abierto')) {
        this.Pintarllamada(99999);
        if (!this.Estado.Textosllamada) this.Fijarestado({ Textosllamada: true, Contacto: 'Abierto' });
        return;
      }
      if (this.Cuadrollamada) cancelAnimationFrame(this.Cuadrollamada);
      const Paso = (Ahora) => {
        if (!this.Llamada) return;
        if (this.Llamada.Inicio === null) this.Llamada.Inicio = Ahora;
        const T = Ahora - this.Llamada.Inicio;
        this.Pintarllamada(T);
        if (T > 2950 && !this.Estado.Textosllamada) this.Fijarestado({ Textosllamada: true });
        if (T < 3700) { this.Cuadrollamada = requestAnimationFrame(Paso); } else { this.Cuadrollamada = null; this.Fijarestado({ Contacto: 'Abierto' }); }
      };
      this.Cuadrollamada = requestAnimationFrame(Paso);
    },

    Pintarllamada(T) {
      const L = this.Llamada;
      const N = this.Nodosllamada;
      if (!L || !N.Mundo) return;
      const Limitar = (V) => Math.max(0, Math.min(1, V));
      const Suave = (A, B, V) => { const X = Limitar((V - A) / (B - A)); return X * X * (3 - 2 * X); };
      const Entradasalida = (V) => (V < 0.5 ? 4 * V * V * V : 1 - Math.pow(-2 * V + 2, 3) / 2);
      const Rebote = (V) => { const Factora = 1.3, Factorb = Factora + 1; return 1 + Factorb * Math.pow(V - 1, 3) + Factora * Math.pow(V - 1, 2); };
      const Mezcla = (A, B, V) => A + (B - A) * V;

      const P = Entradasalida(Limitar((T - 180) / 1950));
      const Offset = L.Longitud * (1 - P);
      N.Cablelargo.style.strokeDashoffset = String(Offset);
      N.Cablelargobrillo.style.strokeDashoffset = String(Offset);
      const Meta = P * L.Guia[L.Guia.length - 1].s;
      let Indice = 1;
      while (Indice < L.Guia.length - 1 && L.Guia[Indice].s < Meta) Indice += 1;
      const Punta = L.Guia[Indice];
      const Seguir = { x: L.Ancho / 2, y: Math.max(L.Alto / 2, Math.min(L.Alto * 2.5, Punta.y)) };
      const Acercar = Suave(0.6, 1, P);
      let Cx = Mezcla(Seguir.x, L.Foco.x, Acercar);
      let Cy = Mezcla(Seguir.y, L.Foco.y, Acercar);
      let Zoom = Mezcla(1, L.Zoomfoco, Acercar);

      const Apretar = Math.sin(Math.PI * Limitar((T - 2150) / 330));
      const Q = Limitar((T - 2480) / 1100);
      const Qcamara = Entradasalida(Q);
      if (Q > 0) {
        Cx = Mezcla(L.Foco.x, L.Centrofinal.x, Qcamara);
        Cy = Mezcla(L.Foco.y, L.Centrofinal.y, Qcamara);
        Zoom = Mezcla(L.Zoomfoco, 1, Qcamara);
      }
      N.Mundo.style.transform = 'translate(' + (L.Ancho / 2 - Cx * Zoom).toFixed(1) + 'px, ' + (L.Alto / 2 - Cy * Zoom).toFixed(1) + 'px) scale(' + Zoom.toFixed(4) + ')';

      const Presencia = 1 - Suave(0.1, 0.65, Q);
      N.Cablelargo.style.opacity = Presencia.toFixed(3);
      N.Cablelargobrillo.style.opacity = (Presencia * 0.55).toFixed(3);
      const Qg = Q > 0 ? Rebote(Q) : 0;
      const Reposo = { X: 82, Y: 145, R: 27.3, S: 0.55 };
      const Gx = Mezcla(Reposo.X, 0, Qg), Gy = Mezcla(Reposo.Y, 0, Qg), Gr = Mezcla(Reposo.R, 0, Qg);
      const Gs = Mezcla(Reposo.S, 1, Qg) * (1 - 0.035 * Apretar);
      N.Grupo.style.transform = 'translate(' + (Gx * L.K).toFixed(2) + 'px, ' + (Gy * L.K).toFixed(2) + 'px) rotate(' + Gr.toFixed(3) + 'deg) scale(' + Gs.toFixed(4) + ')';

      const M = { x: 439, y: 207 };
      const B = { x: 256, y: 286 };
      const Rad = Gr * Math.PI / 180;
      const Dx = (B.x - M.x) * Gs, Dy = (B.y - M.y) * Gs;
      const Bp = { x: M.x + Dx * Math.cos(Rad) - Dy * Math.sin(Rad) + Gx, y: M.y + Dx * Math.sin(Rad) + Dy * Math.cos(Rad) + Gy };
      const A = { x: 352, y: 528 };
      const Guia = window.Geometria.Bezier(Bp, { x: Bp.x - 34, y: Bp.y + 150 }, { x: A.x - 170, y: A.y + 40 }, A, 80);
      if (N.Cablecorto) N.Cablecorto.setAttribute('d', window.Geometria.Espiral(Guia, 30, 8.5, 0));
      if (N.Cablecortobrillo) N.Cablecortobrillo.setAttribute('d', window.Geometria.Espiral(Guia, 30, 8.5, -1.3));
    }
  };
})();

