/* Portafolio de Jorge David Perdomo
   Módulo de transiciones cinemáticas entre secciones, palabra flotante y vuelo de iconos
*/
(function () {
  'use strict';

  window.MetodosTransiciones = {
    // Cambio de pantalla: la palabra se rebana, aparece pequeña y crece hasta su lugar
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
      const Pantallaactual = Estado.Pantalla || 'Inicio';
      const Indiceactual = this.Tarjetas.findIndex((T) => T.Proyecto === Pantallaactual);
      const Indicedestino = this.Tarjetas.findIndex((T) => T.Proyecto === Destino);
      let Vuelofinal = Vuelo || null;
      let Proyectonuevo = Estado.Proyecto || 0;

      if (Indicedestino >= 0) Proyectonuevo = Indicedestino;

      const Medir = (Nodo) => {
        if (!Nodo) return null;
        const Caja = Nodo.getBoundingClientRect();
        const Lado = Nodo.offsetWidth || Caja.width;
        const Centrox = Caja.left + Caja.width / 2 - Lado / 2;
        const Centroy = Caja.top + Caja.height / 2 - Lado / 2;
        const Envista = Caja.bottom > 0 && Caja.top < window.innerHeight;
        return {
          X: Centrox,
          Y: Envista ? Centroy : Math.round(window.innerHeight * 0.22),
          Lado: Lado,
          Angulo: -8
        };
      };

      if (!Vuelofinal && Indicedestino >= 0) {
        const Datosdestino = this.Tarjetas[Indicedestino];
        const Nodoactual = this.Nodosicono[Pantallaactual] || (Indiceactual >= 0 ? this.Nodostarjeta[Indiceactual] : null);
        const Origen = Medir(Nodoactual);
        if (Origen) {
          this.Origenvuelo = Origen;
          Vuelofinal = { Imagen: Datosdestino.Imagen, Moderador: !Datosdestino.Imagen };
        }
      } else if (!Vuelofinal && Indiceactual >= 0) {
        const Datosactual = this.Tarjetas[Indiceactual];
        const Origen = Medir(this.Nodosicono[Pantallaactual]);
        if (Origen) {
          this.Origenvuelo = Origen;
          if (Destino === 'Inicio') {
            Proyectonuevo = Indiceactual;
            Vuelofinal = {
              Imagen: Datosactual.Imagen,
              Moderador: !Datosactual.Imagen,
              Regreso: true,
              Indice: Indiceactual
            };
          } else {
            Vuelofinal = {
              Imagen: Datosactual.Imagen,
              Moderador: !Datosactual.Imagen,
              Despedida: true
            };
          }
        }
      }

      this.Destino = Destino;
      this.Palabralista = false;
      this.Palabracrece = false;
      this.Fijarestado({
        Proyecto: Proyectonuevo,
        Saliendo: true,
        Menuabierto: false,
        Palabra: { Texto: Titulo.Texto, Clase: Titulo.Clase, Tamano: Titulo.Tamano },
        Vuelo: Vuelofinal
      });

      this.Esperar(440, () => {
        this.Fijarestado({ Pantalla: Destino, Saliendo: false, Llegando: true, Llegada: true, Pila: 0, Portatilabierto: false, Foco: -1 });
        this.Subir();
        if (this.Estado && this.Estado.Vuelo && this.Estado.Vuelo.Despedida) {
          this.Doblecuadro(() => this.Viajarvuelo());
        }
        this.Esperar(300, () => this.Doblecuadro(() => this.Crecerpalabra()));
      });
    },

    Subir() {
      try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (Error) {
        try { window.scrollTo(0, 0); } catch (Error2) {}
      }
    },

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
      this.Palabralista = true;
      Nodo.classList.add('Lista');
    },

    Crecerpalabra() {
      const Nodo = this.Nodopalabra;
      const Destino = this.Nodostitulo[this.Destino];
      if (!Nodo || !Destino || !this.Cajapalabra) { this.Terminarcambio(); return; }
      const Caja = Destino.getBoundingClientRect();
      const Escala = Caja.width / Math.max(1, this.Cajapalabra.Ancho);
      const X = Caja.left - this.Cajapalabra.X * Escala;
      const Y = Caja.top - this.Cajapalabra.Y * Escala;
      this.Palabracrece = true;
      Nodo.classList.add('Lista', 'Crece');
      Nodo.style.transform = 'translate(' + X.toFixed(1) + 'px, ' + Y.toFixed(1) + 'px) scale(' + Escala.toFixed(4) + ')';
      if (this.Estado && this.Estado.Vuelo) this.Viajarvuelo();
      this.Esperar(720, () => this.Terminarcambio());
    },

    Terminarcambio() {
      this.Palabralista = false;
      this.Palabracrece = false;
      this.Fijarestado({ Palabra: null, Llegando: false, Vuelo: null });
    },

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
    },

    Colocarvuelo() {
      const Nodo = this.Nodovuelo;
      const Origen = this.Origenvuelo;
      if (!Nodo || !Origen) return;
      Nodo.classList.remove('Viaja', 'Despedida');
      Nodo.style.opacity = '1';
      Nodo.style.left = Origen.X + 'px';
      Nodo.style.top = Origen.Y + 'px';
      Nodo.style.width = Origen.Lado + 'px';
      Nodo.style.height = Origen.Lado + 'px';
      Nodo.style.fontSize = (Origen.Lado / 116 * 16) + 'px';
      Nodo.style.transform = 'rotate(' + Origen.Angulo.toFixed(2) + 'deg) scale(1.08)';
    },

    Viajarvuelo() {
      const Nodo = this.Nodovuelo;
      const Vuelo = this.Estado && this.Estado.Vuelo;
      if (!Nodo || !Vuelo) return;

      if (Vuelo.Despedida) {
        if (Nodo.classList.contains('Despedida')) return;
        Nodo.classList.add('Viaja', 'Despedida');
        Nodo.style.transform = 'translateY(-28px) rotate(6deg) scale(0.45)';
        Nodo.style.opacity = '0';
        return;
      }

      if (Vuelo.Regreso) {
        const Destino = this.Nodostarjeta[Vuelo.Indice];
        if (!Destino) return;
        const Caja = Destino.getBoundingClientRect();
        const Lado = Destino.offsetWidth || Caja.width;
        Nodo.classList.add('Viaja');
        Nodo.style.left = (Caja.left + Caja.width / 2 - Lado / 2) + 'px';
        Nodo.style.top = (Caja.top + Caja.height / 2 - Lado / 2) + 'px';
        Nodo.style.width = Lado + 'px';
        Nodo.style.height = Lado + 'px';
        Nodo.style.fontSize = (Lado / 116 * 16) + 'px';
        Nodo.style.transform = 'rotate(0deg) scale(1)';
        return;
      }

      const Destino = this.Nodosicono[this.Destino];
      if (!Destino) return;
      const Caja = Destino.getBoundingClientRect();
      const Lado = Destino.offsetWidth || Caja.width;
      Nodo.classList.add('Viaja');
      Nodo.style.left = (Caja.left + Caja.width / 2 - Lado / 2) + 'px';
      Nodo.style.top = (Caja.top + Caja.height / 2 - Lado / 2) + 'px';
      Nodo.style.width = Lado + 'px';
      Nodo.style.height = Lado + 'px';
      Nodo.style.fontSize = (Lado / 116 * 16) + 'px';
      Nodo.style.transform = 'rotate(-8deg)';
    }
  };
})();

