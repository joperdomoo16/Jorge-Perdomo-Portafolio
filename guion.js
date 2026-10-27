/* Portafolio de Jorge David Perdomo
   Controlador principal del portafolio (Vanilla JS sin frameworks)
*/
(function () {
  'use strict';

  class Portafolio {
    constructor(Raiz) {
      this.Raiz = Raiz;
      this.Vista = {};
      this.Nodosref = {};
      this.Trozos = new Map();
      this.Estado = Object.assign({}, window.Datosportafolio.Estadobase);
      this.state = this.Estado;
      this.Preparar();
    }

    Movimientoreducido() {
      return window.Utilidades.Movimientoreducido();
    }

    Esperar(Milisegundos, Accion) {
      const Id = setTimeout(() => {
        this.Temporizadores = this.Temporizadores.filter((Otro) => Otro !== Id);
        Accion();
      }, Milisegundos);
      this.Temporizadores.push(Id);
    }

    Doblecuadro(Accion) {
      const Primero = requestAnimationFrame(() => {
        const Segundo = requestAnimationFrame(Accion);
        this.Cuadros.push(Segundo);
      });
      this.Cuadros.push(Primero);
    }

    Preparar() {
      if (this.Listo) return;
      this.Listo = true;
      this.Temporizadores = [];
      this.Cuadros = [];

      this.Titulos = window.Datosportafolio.Titulos;
      this.Tarjetas = window.Datosportafolio.Tarjetas;
      this.Capturas = window.Datosportafolio.Capturas;
      this.Pies = window.Datosportafolio.Pies;

      this.Nodostitulo = {};
      this.Nodosicono = {};
      this.Fijartitulo = {};
      this.Fijaricono = {};

      Object.keys(this.Titulos).forEach((Id) => {
        this.Fijartitulo[Id] = (Nodo) => { this.Nodostitulo[Id] = Nodo; };
        this.Fijaricono[Id] = (Nodo) => { this.Nodosicono[Id] = Nodo; };
      });

      this.Nodostarjeta = [null, null, null];
      this.Fijarcartel = [0, 1, 2].map((Indice) => (Nodo) => { this.Nodostarjeta[Indice] = Nodo; });
      this.Pulsarcarteles = [0, 1, 2].map((Indice) => () => this.Pulsarcartel(Indice));
      this.Cartelanterior = () => this.Girarcartel(-1);
      this.Cartelsiguiente = () => this.Girarcartel(1);
      this.Teclascarteles = (Evento) => this.Teclascartel(Evento);

      this.Ira = {};
      Object.keys(this.Titulos).forEach((Id) => { this.Ira[Id] = () => this.Ir(Id); });

      this.Alternarmenu = () => this.Fijarestado({ Menuabierto: !(this.Estado && this.Estado.Menuabierto) });
      this.Fijarpalabra = (Nodo) => { this.Nodopalabra = Nodo; if (Nodo) this.Colocarpalabra(); };
      this.Fijarvuelo = (Nodo) => { this.Nodovuelo = Nodo; if (Nodo) this.Colocarvuelo(); };

      // Contacto
      this.Abrircontacto = (Evento) => this.Mostrarcontacto(Evento);
      this.Cerrarcontacto = () => this.Ocultarcontacto();
      this.Teclascontacto = (Evento) => {
        if (Evento.key === 'Escape') { Evento.preventDefault(); this.Ocultarcontacto(); }
      };
      this.Fijarbotoncontacto = (Nodo) => { this.Botoncontacto = Nodo; };
      this.Fijarcerrar = (Nodo) => {
        if (!Nodo) return;
        try { Nodo.focus({ preventScroll: true }); } catch (Error) {}
      };

      this.Nodosllamada = {};
      this.Fijarllamada = {};
      this.Alternartapa = () => this.Fijarestado((Previo) => ({ Portatilabierto: !Previo.Portatilabierto }));

      ['Mundo', 'Svglargo', 'Cablelargo', 'Cablelargobrillo', 'Escena', 'Cablecorto', 'Cablecortobrillo', 'Grupo', 'Textos'].forEach((Nombre) => {
        this.Fijarllamada[Nombre] = (Nodo) => {
          this.Nodosllamada[Nombre] = Nodo;
          if (Nodo && Nombre === 'Grupo') this.Doblecuadro(() => this.Iniciarllamada());
        };
      });

      this.Fijarcampo = (Nodo) => { this.Campocorreo = Nodo; };
      this.Barajar = () => this.Fijarestado((Previo) => ({ Pila: (Previo.Pila || 0) + 1 }));
      this.Capturasiguiente = () => this.Fijarestado((Previo) => ({ Pila: (Previo.Pila || 0) + 1 }));
      this.Capturaanterior = () => this.Fijarestado((Previo) => ({ Pila: (Previo.Pila || 0) - 1 }));

      this.Copiarcorreo = () => {
        const Correo = 'joperdomoo16@gmail.com';
        window.Utilidades.Copiartexto(Correo, this.Campocorreo, (Exito) => {
          if (Exito) {
            this.Fijarestado({ Copiado: true });
            this.Esperar(2200, () => this.Fijarestado({ Copiado: false }));
          }
        });
      };

      this.Alredimensionar = () => {
        if (this.Estado && this.Estado.Contacto && this.Llamada) this.Iniciarllamada(true);
      };
    }

    Montar() {
      this.Preparar();
      window.addEventListener('resize', this.Alredimensionar);
    }

    Desmontar() {
      window.removeEventListener('resize', this.Alredimensionar);
      this.Temporizadores.forEach((Id) => clearTimeout(Id));
      this.Cuadros.forEach((Id) => cancelAnimationFrame(Id));
      if (this.Cuadro) cancelAnimationFrame(this.Cuadro);
      if (this.Cuadrollamada) cancelAnimationFrame(this.Cuadrollamada);
    }

    // Cambio de pantalla: la palabra se rebana, aparece pequena y crece hasta su lugar
    Ir(Destino, Vuelo) {
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      if (Destino === Estado.Pantalla) { this.Fijarestado({ Menuabierto: false }); return; }
      if (this.Movimientoreducido()) {
        this.Fijarestado({ Pantalla: Destino, Menuabierto: false, Pila: 0, Portatilabierto: false, Foco: -1 });
        this.Subir();
        return;
      }
      const Titulo = this.Titulos[Destino];
      this.Destino = Destino;
      this.Fijarestado({
        Saliendo: true,
        Menuabierto: false,
        Palabra: { Texto: Titulo.Texto, Clase: Titulo.Clase, Tamano: Titulo.Tamano },
        Vuelo: Vuelo || null
      });

      this.Esperar(440, () => {
        this.Fijarestado({ Pantalla: Destino, Saliendo: false, Llegando: true, Llegada: true, Pila: 0, Portatilabierto: false, Foco: -1 });
        this.Subir();
        this.Esperar(300, () => this.Doblecuadro(() => this.Crecerpalabra()));
      });
    }

    Subir() {
      try { window.scrollTo(0, 0); } catch (Error) {}
    }

    Colocarpalabra() {
      const Nodo = this.Nodopalabra;
      if (!Nodo) return;
      const Interior = Nodo.firstElementChild;
      if (!Interior) return;
      Nodo.style.transform = 'none';
      const Caja = Interior.getBoundingClientRect();
      this.Cajapalabra = { Ancho: Caja.width, Alto: Caja.height, X: Caja.left, Y: Caja.top };
      const Ancho = window.innerWidth;
      const Alto = window.innerHeight;
      const Escala = Math.min(0.5, (Ancho < 700 ? Ancho * 0.36 : 300) / Math.max(1, Caja.width));
      const X = Ancho / 2 - (Caja.width * Escala) / 2 - Caja.left * Escala;
      const Y = Alto / 2 - (Caja.height * Escala) / 2 - Caja.top * Escala;
      Nodo.style.transform = 'translate(' + X.toFixed(1) + 'px, ' + Y.toFixed(1) + 'px) scale(' + Escala.toFixed(4) + ')';
      Nodo.classList.add('Lista');
    }

    Crecerpalabra() {
      const Nodo = this.Nodopalabra;
      const Destino = this.Nodostitulo[this.Destino];
      if (!Nodo || !Destino || !this.Cajapalabra) { this.Terminarcambio(); return; }
      const Caja = Destino.getBoundingClientRect();
      const Escala = Caja.width / Math.max(1, this.Cajapalabra.Ancho);
      const X = Caja.left - this.Cajapalabra.X * Escala;
      const Y = Caja.top - this.Cajapalabra.Y * Escala;
      Nodo.classList.add('Crece');
      Nodo.style.transform = 'translate(' + X.toFixed(1) + 'px, ' + Y.toFixed(1) + 'px) scale(' + Escala.toFixed(4) + ')';
      if (this.Estado && this.Estado.Vuelo) this.Viajarvuelo();
      this.Esperar(720, () => this.Terminarcambio());
    }

    Terminarcambio() {
      this.Fijarestado({ Palabra: null, Llegando: false, Vuelo: null });
    }

    Abrirproyecto(Indice) {
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      const Datos = this.Tarjetas[Indice];
      const Nodo = this.Nodostarjeta[Indice];
      if (!Nodo || this.Movimientoreducido()) { this.Ir(Datos.Proyecto); return; }
      const Caja = Nodo.getBoundingClientRect();
      const Lado = Nodo.offsetWidth;
      this.Origenvuelo = { X: Caja.left + Caja.width / 2 - Lado / 2, Y: Caja.top + Caja.height / 2 - Lado / 2, Lado: Lado, Angulo: 0 };
      this.Ir(Datos.Proyecto, { Imagen: Datos.Imagen, Moderador: !Datos.Imagen });
    }

    Colocarvuelo() {
      const Nodo = this.Nodovuelo;
      const Origen = this.Origenvuelo;
      if (!Nodo || !Origen) return;
      Nodo.classList.remove('Viaja');
      Nodo.style.left = Origen.X + 'px';
      Nodo.style.top = Origen.Y + 'px';
      Nodo.style.width = Origen.Lado + 'px';
      Nodo.style.height = Origen.Lado + 'px';
      Nodo.style.fontSize = (Origen.Lado / 116 * 16) + 'px';
      Nodo.style.transform = 'rotate(' + Origen.Angulo.toFixed(2) + 'deg) scale(1.12)';
    }

    Viajarvuelo() {
      const Nodo = this.Nodovuelo;
      const Destino = this.Nodosicono[this.Destino];
      if (!Nodo || !Destino) return;
      const Caja = Destino.getBoundingClientRect();
      const Lado = Destino.offsetWidth;
      Nodo.classList.add('Viaja');
      Nodo.style.left = (Caja.left + Caja.width / 2 - Lado / 2) + 'px';
      Nodo.style.top = (Caja.top + Caja.height / 2 - Lado / 2) + 'px';
      Nodo.style.width = Lado + 'px';
      Nodo.style.height = Lado + 'px';
      Nodo.style.fontSize = (Lado / 116 * 16) + 'px';
      Nodo.style.transform = 'rotate(-8deg)';
    }

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
    }

    Ocultarcontacto() {
      if (!this.Estado || !this.Estado.Contacto || this.Estado.Contacto === 'Cierra') return;
      if (this.Cuadrollamada) { cancelAnimationFrame(this.Cuadrollamada); this.Cuadrollamada = null; }
      const Devolverfoco = () => {
        try { if (this.Botonorigen) this.Botonorigen.focus({ preventScroll: true }); } catch (Error) {}
      };
      if (this.Movimientoreducido()) { this.Fijarestado({ Contacto: '' }); Devolverfoco(); return; }
      this.Fijarestado({ Contacto: 'Cierra' });
      this.Esperar(580, () => { this.Fijarestado({ Contacto: '' }); Devolverfoco(); });
    }

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
    }

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

    Girarcartel(Paso) {
      const Total = this.Tarjetas.length;
      this.Fijarestado((Previo) => ({ Proyecto: ((((Previo.Proyecto || 0) + Paso) % Total) + Total) % Total }));
    }

    Pulsarcartel(Indice) {
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      if ((Estado.Proyecto || 0) !== Indice) { this.Fijarestado({ Proyecto: Indice }); return; }
      this.Abrirproyecto(Indice);
    }

    Teclascartel(Evento) {
      const Teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!Teclas[Evento.key]) return;
      Evento.preventDefault();
      this.Girarcartel(Teclas[Evento.key]);
    }

    Calcular() {
      this.Preparar();
      const Estado = this.Estado || {};
      const Pantalla = Estado.Pantalla || 'Inicio';
      const Acentos = { 'Rojo bermellón': '', 'Rojo profundo': ' Acentoprofundo', 'Tinta': ' Acentotinta' };
      const Claseacento = Acentos['Rojo bermellón'] || '';
      const Nav = { Mostrarinicio: Pantalla !== 'Inicio' };

      Object.keys(this.Titulos).forEach((Id) => {
        const Activo = Pantalla === Id;
        Nav[Id] = { Clase: 'Enlacenav Conrodillo' + (Activo ? ' Activo' : ''), Actual: Activo ? 'page' : 'false', Ir: this.Ira[Id] };
      });

      const Activo = Estado.Proyecto || 0;
      const Totalcarteles = this.Tarjetas.length;
      const Cartelinfo = (Indice) => {
        const Puesto = ((((Indice - Activo + 1) % Totalcarteles) + Totalcarteles) % Totalcarteles) - 1;
        const Escentro = Puesto === 0;
        const Datos = this.Tarjetas[Indice];
        const Giro = Escentro ? 0 : (Puesto < 0 ? 30 : -30);
        return {
          Clase: 'Cartel' + (Escentro ? ' Activo' : ''),
          Estilo: 'transform: translateX(' + (Puesto * 88) + '%) scale(' + (Escentro ? 1 : 0.78) + ') rotateY(' + Giro + 'deg); z-index: ' + (Escentro ? 5 : 3) + '; opacity: ' + (Escentro ? 1 : 0.88),
          Pulsar: this.Pulsarcarteles[Indice],
          Fijar: this.Fijarcartel[Indice],
          Etiqueta: (Escentro ? 'Abrir ' : 'Ver ') + Datos.Titulo + ', ' + Datos.Tipo
        };
      };

      const Total = this.Capturas[Pantalla] || 3;
      const Activa = (((Estado.Pila || 0) % Total) + Total) % Total;
      const Posiciones = Total === 2 ? ['Frente', 'Fondo'] : ['Frente', 'Medio', 'Fondo'];
      const Clasepila = (Orden) => {
        if (Orden >= Total) return '';
        const Lugar = Posiciones[(Orden - Activa + Total) % Total];
        const Recien = (Estado.Pila || 0) > 0 && Orden === (Activa - 1 + Total) % Total;
        return Lugar + (Recien ? ' Recien' : '');
      };

      const Tapaabierta = !!Estado.Portatilabierto;
      const Palabra = Estado.Palabra;
      const Vuelo = Estado.Vuelo;
      const Contacto = Estado.Contacto || '';

      return {
        Raiz: { Clase: 'Raiz' + Claseacento },
        Capa: { Fondooculto: Contacto ? 'true' : 'false' },
        Clases: { Pantalla: 'Pantalla' + (Estado.Saliendo ? ' Saliendo' : '') + (Estado.Llegando ? ' Llegando' : '') + (Estado.Llegada ? ' Llegada' : '') },
        Ver: {
          Inicio: Pantalla === 'Inicio',
          Habilidades: Pantalla === 'Habilidades',
          Experiencia: Pantalla === 'Experiencia',
          Conoceme: Pantalla === 'Conoceme',
          Sonica: Pantalla === 'Sonica',
          Neon: Pantalla === 'Neon',
          Moderador: Pantalla === 'Moderador'
        },
        Nav: Nav,
        Titulo: this.Fijartitulo,
        Icono: this.Fijaricono,
        Menu: {
          Abierto: !!Estado.Menuabierto,
          Expandido: Estado.Menuabierto ? 'true' : 'false',
          Texto: Estado.Menuabierto ? 'Cerrar' : 'Menú',
          Alternar: this.Alternarmenu
        },
        Cartel: {
          Uno: Cartelinfo(0),
          Dos: Cartelinfo(1),
          Tres: Cartelinfo(2),
          Cuenta: String(Activo + 1).padStart(2, '0') + ' / ' + String(Totalcarteles).padStart(2, '0'),
          Teclas: this.Teclascarteles,
          Anterior: this.Cartelanterior,
          Siguiente: this.Cartelsiguiente
        },
        Proyectos: { Sonica: this.Ira.Sonica, Neon: this.Ira.Neon, Moderador: this.Ira.Moderador },
        Pila: {
          Uno: Clasepila(0),
          Dos: Clasepila(1),
          Tres: Clasepila(2),
          Contador: (Activa + 1) + ' / ' + Total,
          Barajar: this.Barajar
        },
        Carrusel: {
          Estilo: 'transform: translateX(-' + (Activa * 100) + '%)',
          Etiqueta: String(Activa + 1).padStart(2, '0') + ' / ' + String(Total).padStart(2, '0'),
          Puntouno: 'Puntomovil' + (Activa === 0 ? ' Activo' : ''),
          Puntodos: 'Puntomovil' + (Activa === 1 ? ' Activo' : ''),
          Puntotres: 'Puntomovil' + (Activa === 2 ? ' Activo' : ''),
          Punto1: 'Puntomovil' + (Activa === 0 ? ' Activo' : ''),
          Punto2: 'Puntomovil' + (Activa === 1 ? ' Activo' : ''),
          Punto3: 'Puntomovil' + (Activa === 2 ? ' Activo' : ''),
          Pie: (this.Pies[Pantalla] || [])[Activa] || '',
          Anterior: this.Capturaanterior,
          Siguiente: this.Capturasiguiente
        },
        Portal: {
          Clase: 'Portatil' + (Tapaabierta ? ' Abierto' : ''),
          Alternar: this.Alternartapa,
          Abierta: Tapaabierta ? 'true' : 'false',
          Etiqueta: Tapaabierta ? 'Cerrar el portátil' : 'Abrir el portátil para ver las capturas'
        },
        Palabra: {
          Visible: !!Palabra,
          Texto: Palabra ? Palabra.Texto : '',
          Clase: Palabra ? Palabra.Clase : 'Palabragigante',
          Estilo: Palabra && Palabra.Tamano ? 'font-size: ' + Palabra.Tamano : '',
          Clasecontenedor: 'Palabraflotante',
          Fijar: this.Fijarpalabra
        },
        Vuelo: {
          Visible: !!Vuelo,
          Esimagen: !!(Vuelo && !Vuelo.Moderador),
          Esmoderador: !!(Vuelo && Vuelo.Moderador),
          Estiloimagen: Vuelo && Vuelo.Imagen ? 'background-image: url(' + Vuelo.Imagen + ')' : '',
          Fijar: this.Fijarvuelo
        },
        Contacto: {
          Visible: !!Contacto,
          Clase: 'Contacto ' + Contacto + (Estado.Textosllamada ? ' Textosvisibles' : ''),
          X: Estado.Origenx || 0,
          Y: Estado.Origeny || 0,
          Abrir: this.Abrircontacto,
          Cerrar: this.Cerrarcontacto,
          Teclas: this.Teclascontacto,
          Fijarboton: this.Fijarbotoncontacto,
          Fijarcerrar: this.Fijarcerrar
        },
        Llamada: this.Fijarllamada,
        Correo: {
          Texto: Estado.Copiado ? 'Copiado' : 'Copiar',
          Etiqueta: Estado.Copiado ? 'Correo copiado' : 'Copiar correo',
          Copiar: this.Copiarcorreo,
          Campo: this.Fijarcampo
        }
      };
    }
  }

  // Conectar el motor reactivo con el prototipo de Portafolio
  window.Motorreactivo.Aplicar(Portafolio.prototype);

  var App = new Portafolio(document.body);
  try {
    App.Pintar();
    App.Escuchar();
    App.Montar();
  } finally {
    document.body.classList.remove('Cargando');
  }
  window.Portafoliojorge = App;
})();
