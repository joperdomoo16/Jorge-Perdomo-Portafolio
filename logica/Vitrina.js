/* Portafolio de Jorge David Perdomo
   Módulo de la vitrina interactiva: rueda giratoria de proyectos con física de resorte,
   arrastre con inercia, rueda del ratón, dial graduado e inclinación 3D al cursor
*/
(function () {
  'use strict';

  // Geometría de la rueda: cuatro proyectos cada 22.5° en abanico apretado
  // (el dial repite la secuencia cuatro veces en 360°)
  const Pasogrados = 22.5;
  const Pasoradianes = Pasogrados * Math.PI / 180;
  const Factorradio = 2.3;          // Radio de la rueda en múltiplos del lado de la tarjeta (ver .Esfera en Inicio.css)
  const Rigidez = 210;              // Resorte del asentamiento
  const Amortiguacion = 18.5;       // Leve rebote al detenerse, como en la referencia
  const Seguimiento = 0.42;         // Giro máximo (en tarjetas) con el que la rueda sigue al cursor
  const Imanradio = 1.5;            // Alcance del imán del cursor, en lados de tarjeta
  const Modulo = (Numero, Total) => ((Numero % Total) + Total) % Total;
  const Limitar = (Valor, Minimo, Maximo) => Math.max(Minimo, Math.min(Maximo, Valor));

  window.MetodosVitrina = {
    // ---- Montaje -------------------------------------------------------------
    Montarrueda(Nodo) {
      if (this.Nodorueda) {
        const Viejo = this.Nodorueda;
        Viejo.removeEventListener('pointerdown', this.Manejadoresrueda.Bajar);
        Viejo.removeEventListener('pointermove', this.Manejadoresrueda.Mover);
        Viejo.removeEventListener('pointerup', this.Manejadoresrueda.Subir);
        Viejo.removeEventListener('pointercancel', this.Manejadoresrueda.Subir);
        Viejo.removeEventListener('wheel', this.Manejadoresrueda.Girar);
      }
      if (this.Nodoescenario) {
        this.Nodoescenario.removeEventListener('pointermove', this.Manejadoresrueda.Seguir);
        this.Nodoescenario.removeEventListener('pointerleave', this.Manejadoresrueda.Olvidar);
        this.Nodoescenario = null;
      }
      this.Nodorueda = Nodo;
      if (this.Cuadrorueda) cancelAnimationFrame(this.Cuadrorueda);
      this.Cuadrorueda = null;
      clearTimeout(this.Esperarueda);
      if (!Nodo) { if (this.Rueda) this.Rueda.Arrastre = null; return; }

      if (!this.Manejadoresrueda) {
        this.Manejadoresrueda = {
          Bajar: (Evento) => this.Empezarcartel(Evento),
          Mover: (Evento) => this.Movercartel(Evento),
          Subir: (Evento) => this.Soltarcartel(Evento),
          Girar: (Evento) => this.Girarconraton(Evento),
          Seguir: (Evento) => this.Seguircursor(Evento),
          Olvidar: () => this.Olvidarcursor()
        };
      }
      Nodo.addEventListener('pointerdown', this.Manejadoresrueda.Bajar);
      Nodo.addEventListener('pointermove', this.Manejadoresrueda.Mover);
      Nodo.addEventListener('pointerup', this.Manejadoresrueda.Subir);
      Nodo.addEventListener('pointercancel', this.Manejadoresrueda.Subir);
      Nodo.addEventListener('wheel', this.Manejadoresrueda.Girar, { passive: false });
      // Todo el escenario de inicio alimenta el seguimiento del cursor
      this.Nodoescenario = Nodo.closest('.Escenario');
      if (this.Nodoescenario) {
        this.Nodoescenario.addEventListener('pointermove', this.Manejadoresrueda.Seguir);
        this.Nodoescenario.addEventListener('pointerleave', this.Manejadoresrueda.Olvidar);
      }

      // Los botones se registran después de la lista: se espera al final del pintado
      Promise.resolve().then(() => { if (this.Nodorueda === Nodo) this.Iniciarrueda(); });
    },

    Montaresfera(Nodo) {
      this.Nodoesfera = Nodo;
      this.Giroesfera = Nodo ? Nodo.querySelector('.Esferagiro') : null;
    },

    Iniciarrueda() {
      const Estado = this.Estado || {};
      const Total = this.Tarjetas.length;
      const Proyecto = Estado.Proyecto || 0;
      const Previa = this.Rueda;
      // Conserva las vueltas acumuladas si la rueda ya estaba en el mismo proyecto
      const Objetivo = Previa && Modulo(Previa.Objetivo, Total) === Proyecto ? Previa.Objetivo : Proyecto;
      this.Rueda = {
        Posicion: Objetivo, Objetivo: Objetivo, Velocidad: 0,
        Arrastre: null, Libre: false, Retenida: false,
        Cursor: null,                 // Puntero relativo al eje superior de la lista (px)
        Desvio: 0,                    // Giro extra pedido por el cursor (tarjetas)
        Iman: this.Tarjetas.map(() => 0)
      };

      const Regreso = Estado.Vuelo && Estado.Vuelo.Regreso;
      if (!this.Movimientoreducido() && !Regreso) {
        // Vuelta de entrada: las tarjetas llegan girando sobre la rueda y se asientan con rebote
        this.Rueda.Posicion = Objetivo - 1.25;
        this.Rueda.Retenida = true;
        this.Colocarrueda();
        this.Esperar(Estado.Llegada ? 900 : 380, () => {
          if (!this.Rueda) return;
          this.Rueda.Retenida = false;
          this.Rueda.Velocidad = 1.6;
          this.Animarrueda();
        });
        return;
      }
      this.Colocarrueda();
    },

    // ---- Dibujo de cada cuadro ----------------------------------------------
    // Dibuja la rueda. Con Delta (segundos) suaviza el imán del cursor; sin él lo fija al instante.
    // Devuelve true mientras el imán siga acomodándose.
    Colocarrueda(Delta) {
      const Rueda = this.Rueda;
      if (!Rueda) return false;
      const Total = this.Tarjetas.length;
      const Mitad = Total / 2;
      const Referencia = this.Nodostarjeta.find((N) => N);
      const Lado = Referencia ? Referencia.offsetWidth : 90;
      const Radio = Lado * Factorradio;
      const Posicion = Rueda.Posicion;
      const Cursor = Rueda.Arrastre && Rueda.Arrastre.Activo ? null : Rueda.Cursor;
      const Suavizado = Delta === undefined ? 1 : 1 - Math.exp(-Delta * 13);
      let Inquieto = false;

      this.Nodostarjeta.forEach((Boton, Indice) => {
        const Cartel = Boton && Boton.parentElement;
        if (!Cartel) return;
        const Desfase = Modulo(Indice - Posicion + Mitad, Total) - Mitad;
        const Distancia = Math.abs(Desfase);
        const Angulo = Desfase * Pasogrados;
        const Radianes = Angulo * Math.PI / 180;
        const Cercania = 1 - Math.min(Distancia, 1);
        let X = Radio * Math.sin(Radianes);
        let Y = Radio * (1 - Math.cos(Radianes)) - 4 * Cercania;
        const Opacidad = Limitar((Mitad - Distancia) / 0.6, 0, 1);

        // Imán: la tarjeta cercana al cursor se acerca a él, sale hacia fuera de la rueda y se agranda
        let Objetivoiman = 0;
        let Haciax = 0;
        let Haciay = 0;
        if (Cursor && Opacidad > 0.6) {
          Haciax = Cursor.X - X;
          Haciay = Cursor.Y - (Y + Lado / 2);
          const Separacion = Math.hypot(Haciax, Haciay);
          Objetivoiman = Limitar(1 - Separacion / (Lado * Imanradio), 0, 1);
          Objetivoiman = Objetivoiman * Objetivoiman * (3 - 2 * Objetivoiman);
        }
        const Iman = Rueda.Iman[Indice] + (Objetivoiman - Rueda.Iman[Indice]) * Suavizado;
        Rueda.Iman[Indice] = Math.abs(Iman - Objetivoiman) < 0.002 ? Objetivoiman : Iman;
        if (Rueda.Iman[Indice] !== Objetivoiman) Inquieto = true;
        const Fuerza = Rueda.Iman[Indice];
        if (Fuerza > 0) {
          X += Math.sin(Radianes) * 10 * Fuerza + Limitar(Haciax, -Lado, Lado) * 0.14 * Fuerza;
          Y += -Math.cos(Radianes) * 10 * Fuerza + Limitar(Haciay, -Lado, Lado) * 0.1 * Fuerza;
        }

        const Escala = 1 - 0.12 * Math.min(Distancia, 1) - 0.08 * Math.max(0, Distancia - 1) + 0.09 * Fuerza;
        Cartel.style.transform = 'translate3d(' + X.toFixed(2) + 'px, ' + Y.toFixed(2) + 'px, 0) rotate(' + (Angulo * (1 - 0.35 * Fuerza)).toFixed(3) + 'deg) scale(' + Escala.toFixed(4) + ')';
        Cartel.style.opacity = Opacidad.toFixed(3);
        Cartel.style.zIndex = String(Math.round(20 - Distancia * 4 + Fuerza * 8));
        Cartel.style.pointerEvents = Opacidad > 0.6 ? 'auto' : 'none';
        Cartel.style.setProperty('--Cercania', Math.max(Cercania, Fuerza).toFixed(3));
      });

      // Las marcas del dial giran solidarias con las tarjetas; el título "Proyectos" queda fijo
      if (this.Giroesfera) {
        this.Giroesfera.setAttribute('transform', 'rotate(' + (-Posicion * Pasogrados).toFixed(3) + ' 200 200)');
      }

      // Mientras se arrastra, el proyecto activo sigue al que pasa por la aguja
      if (Rueda.Arrastre || Rueda.Libre) {
        const Cercano = Modulo(Math.round(Posicion), Total);
        if (Cercano !== ((this.Estado && this.Estado.Proyecto) || 0)) this.Fijarestado({ Proyecto: Cercano });
      }
      return Inquieto;
    },

    // ---- Seguimiento del cursor ---------------------------------------------
    Seguircursor(Evento) {
      const Rueda = this.Rueda;
      if (!Rueda || !this.Nodorueda || Evento.pointerType === 'touch' || this.Movimientoreducido()) return;
      const Caja = this.Nodorueda.getBoundingClientRect();
      const Referencia = this.Nodostarjeta.find((N) => N);
      const Lado = Referencia ? Referencia.offsetWidth : 90;
      const X = Evento.clientX - (Caja.left + Caja.width / 2);
      const Y = Evento.clientY - Caja.top;
      Rueda.Cursor = { X: X, Y: Y };
      // La rueda gira hacia el lado del cursor: con fuerza cerca de la vitrina, suave en lo alto del escenario
      const Horizontal = Limitar(X / (Lado * 4.2), -1, 1);
      const Cercania = Limitar(1 - (-Y) / (window.innerHeight * 0.75), 0.3, 1);
      Rueda.Desvio = -Horizontal * Seguimiento * Cercania;
      this.Animarrueda();
    },

    Olvidarcursor() {
      const Rueda = this.Rueda;
      if (!Rueda) return;
      Rueda.Cursor = null;
      Rueda.Desvio = 0;
      this.Animarrueda();
    },

    Animarrueda() {
      if (this.Cuadrorueda || !this.Rueda) return;
      let Anterior = performance.now();
      const Cuadro = (Ahora) => {
        const Rueda = this.Rueda;
        if (!Rueda || !this.Nodorueda) { this.Cuadrorueda = null; return; }
        const Delta = Math.min(0.034, Math.max(0, (Ahora - Anterior) / 1000));
        Anterior = Ahora;
        const Arrastrando = Rueda.Arrastre && Rueda.Arrastre.Activo;
        let Quieta = Arrastrando || Rueda.Libre || Rueda.Retenida ? false : true;
        if (!Arrastrando && !Rueda.Libre && !Rueda.Retenida) {
          // El resorte apunta al proyecto elegido más el giro que pide el cursor
          const Meta = Rueda.Objetivo + Rueda.Desvio;
          // Integración semi-implícita en dos subpasos para un resorte estable
          for (let Paso = 0; Paso < 2; Paso += 1) {
            const Fuerza = -Rigidez * (Rueda.Posicion - Meta) - Amortiguacion * Rueda.Velocidad;
            Rueda.Velocidad += Fuerza * (Delta / 2);
            Rueda.Posicion += Rueda.Velocidad * (Delta / 2);
          }
          Quieta = Math.abs(Rueda.Posicion - Meta) < 0.0006 && Math.abs(Rueda.Velocidad) < 0.01;
          if (Quieta) { Rueda.Posicion = Meta; Rueda.Velocidad = 0; }
        }
        const Inquieta = this.Colocarrueda(Delta);
        if (Quieta && !Inquieta) { this.Cuadrorueda = null; return; }
        this.Cuadrorueda = requestAnimationFrame(Cuadro);
      };
      this.Cuadrorueda = requestAnimationFrame(Cuadro);
    },

    Fijarobjetivo(Objetivo) {
      const Rueda = this.Rueda;
      const Total = this.Tarjetas.length;
      const Proyecto = Modulo(Objetivo, Total);
      if (!Rueda) { this.Fijarestado({ Proyecto: Proyecto }); return; }
      Rueda.Objetivo = Objetivo;
      Rueda.Retenida = false;
      if (Proyecto !== ((this.Estado && this.Estado.Proyecto) || 0)) this.Fijarestado({ Proyecto: Proyecto });
      if (this.Movimientoreducido()) {
        Rueda.Posicion = Objetivo;
        Rueda.Velocidad = 0;
        this.Colocarrueda();
        return;
      }
      this.Animarrueda();
    },

    Pixelesporcartel() {
      const Referencia = this.Nodostarjeta.find((N) => N);
      const Lado = Referencia ? Referencia.offsetWidth : 90;
      // Algo más que el arco real para que el abanico apretado no gire demasiado rápido bajo el dedo
      return Lado * Factorradio * Pasoradianes * 1.25;
    },

    // ---- Navegación ----------------------------------------------------------
    Girarcartel(Paso) {
      this.Nodostarjeta.forEach((N) => { if (N) this.Limpiarcartel(N); });
      const Rueda = this.Rueda;
      if (!Rueda) {
        const Total = this.Tarjetas.length;
        this.Fijarestado((Previo) => ({ Proyecto: Modulo((Previo.Proyecto || 0) + Paso, Total) }));
        return;
      }
      this.Fijarobjetivo(Rueda.Objetivo + Paso);
    },

    Pulsarcartel(Indice) {
      if (this.Arrastradocartel) return;
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      this.Nodostarjeta.forEach((N) => { if (N) this.Limpiarcartel(N); });
      if ((Estado.Proyecto || 0) !== Indice) {
        const Rueda = this.Rueda;
        if (!Rueda) { this.Fijarestado({ Proyecto: Indice }); return; }
        const Total = this.Tarjetas.length;
        const Camino = Modulo(Indice - Rueda.Objetivo + Total / 2, Total) - Total / 2;
        this.Fijarobjetivo(Rueda.Objetivo + Camino);
        return;
      }
      this.Abrirproyecto(Indice);
    },

    Teclascartel(Evento) {
      const Teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!Teclas[Evento.key]) return;
      Evento.preventDefault();
      this.Girarcartel(Teclas[Evento.key]);
      const Nuevo = this.Nodostarjeta[(this.Estado && this.Estado.Proyecto) || 0];
      if (Nuevo) { try { Nuevo.focus({ preventScroll: true }); } catch (Error) {} }
    },

    // ---- Inclinación 3D al cursor ------------------------------------------
    Inclinarcartel(Indice, Evento) {
      if (this.Movimientoreducido() || Evento.pointerType === 'touch') return;
      if (this.Rueda && this.Rueda.Arrastre && this.Rueda.Arrastre.Activo) return;
      const Nodo = this.Nodostarjeta[Indice];
      if (!Nodo) return;
      const Caja = Nodo.getBoundingClientRect();
      if (!Caja.width || !Caja.height) return;
      const Nx = Limitar(((Evento.clientX - Caja.left) / Caja.width - 0.5) * 2, -1, 1);
      const Ny = Limitar(((Evento.clientY - Caja.top) / Caja.height - 0.5) * 2, -1, 1);
      const Escentro = ((this.Estado && this.Estado.Proyecto) || 0) === Indice;
      const Max = Escentro ? 14 : 9;
      Nodo.style.setProperty('--Inclinax', (-Ny * Max).toFixed(2) + 'deg');
      Nodo.style.setProperty('--Inclinay', (Nx * Max).toFixed(2) + 'deg');
      Nodo.style.setProperty('--Desplazax', (Nx * 4).toFixed(2) + 'px');
      Nodo.style.setProperty('--Desplazay', (Ny * 4 - (Escentro ? 5 : 3)).toFixed(2) + 'px');
      Nodo.style.setProperty('--Brillox', ((Nx + 1) * 50).toFixed(1) + '%');
      Nodo.style.setProperty('--Brilloy', ((Ny + 1) * 50).toFixed(1) + '%');
      Nodo.style.setProperty('--Brillo', Escentro ? '1' : '0.7');
    },

    Limpiarcartel(Nodo) {
      ['--Inclinax', '--Inclinay', '--Desplazax', '--Desplazay', '--Brillo'].forEach((P) => Nodo.style.removeProperty(P));
    },

    Reposocartel(Indice) {
      const Nodo = this.Nodostarjeta[Indice];
      if (Nodo) this.Limpiarcartel(Nodo);
    },

    // ---- Arrastre con inercia -----------------------------------------------
    Empezarcartel(Evento) {
      if ((Evento.button && Evento.button !== 0) || !this.Rueda) return;
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      this.Rueda.Arrastre = {
        Id: Evento.pointerId,
        X: Evento.clientX,
        Y: Evento.clientY,
        Inicio: this.Rueda.Posicion,
        Ultimox: Evento.clientX,
        Ultimotiempo: Evento.timeStamp,
        Activo: false
      };
    },

    Movercartel(Evento) {
      const Rueda = this.Rueda;
      const Arrastre = Rueda && Rueda.Arrastre;
      if (!Arrastre || Evento.pointerId !== Arrastre.Id) return;
      const Dx = Evento.clientX - Arrastre.X;
      const Dy = Evento.clientY - Arrastre.Y;

      if (!Arrastre.Activo) {
        if (Math.abs(Dx) > 7 && Math.abs(Dx) > Math.abs(Dy)) {
          // Arranca el giro: la rueda queda tomada por el puntero
          Arrastre.Activo = true;
          Arrastre.X = Evento.clientX;
          Arrastre.Inicio = Rueda.Posicion;
          Rueda.Velocidad = 0;
          Rueda.Retenida = false;
          this.Nodostarjeta.forEach((N) => { if (N) this.Limpiarcartel(N); });
          this.Nodorueda.classList.add('Girando');
          try { this.Nodorueda.setPointerCapture(Evento.pointerId); } catch (Error) {}
          this.Animarrueda();
        } else if (Math.abs(Dy) > 12) {
          Rueda.Arrastre = null;
        }
        return;
      }

      const Pixeles = this.Pixelesporcartel();
      Rueda.Posicion = Arrastre.Inicio - (Evento.clientX - Arrastre.X) / Pixeles;
      const Tiempo = Math.max(1, Evento.timeStamp - Arrastre.Ultimotiempo) / 1000;
      const Instantanea = -(Evento.clientX - Arrastre.Ultimox) / Pixeles / Tiempo;
      Rueda.Velocidad = Rueda.Velocidad * 0.55 + Limitar(Instantanea, -14, 14) * 0.45;
      Arrastre.Ultimox = Evento.clientX;
      Arrastre.Ultimotiempo = Evento.timeStamp;
    },

    Soltarcartel(Evento) {
      const Rueda = this.Rueda;
      const Arrastre = Rueda && Rueda.Arrastre;
      if (!Arrastre || Evento.pointerId !== Arrastre.Id) return;
      Rueda.Arrastre = null;
      if (!Arrastre.Activo) return;

      this.Nodorueda.classList.remove('Girando');
      try { this.Nodorueda.releasePointerCapture(Evento.pointerId); } catch (Error) {}
      // Evita que el soltar se interprete como clic sobre una tarjeta
      this.Arrastradocartel = true;
      this.Esperar(80, () => { this.Arrastradocartel = false; });

      if (Evento.timeStamp - Arrastre.Ultimotiempo > 90) Rueda.Velocidad = 0;
      // La inercia proyecta el giro; un lanzamiento recorre como máximo dos proyectos extra
      const Proyeccion = Rueda.Posicion + Limitar(Rueda.Velocidad, -9, 9) * 0.12;
      const Objetivo = Limitar(Math.round(Proyeccion), Math.round(Rueda.Posicion) - 2, Math.round(Rueda.Posicion) + 2);
      this.Fijarobjetivo(Objetivo);
    },

    Cancelarcartel() {
      if (this.Rueda && this.Rueda.Arrastre && !this.Rueda.Arrastre.Activo) this.Rueda.Arrastre = null;
    },

    // ---- Rueda del ratón / trackpad ------------------------------------------
    Girarconraton(Evento) {
      const Rueda = this.Rueda;
      if (!Rueda || Evento.ctrlKey) return;
      const Delta = Math.abs(Evento.deltaX) > Math.abs(Evento.deltaY) ? Evento.deltaX : Evento.deltaY;
      if (!Delta) return;
      Evento.preventDefault();
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo || (Rueda.Arrastre && Rueda.Arrastre.Activo)) return;
      const Pixeles = (Evento.deltaMode === 1 ? Delta * 16 : Delta);
      this.Nodostarjeta.forEach((N) => { if (N) this.Limpiarcartel(N); });
      Rueda.Libre = true;
      Rueda.Retenida = false;
      Rueda.Velocidad = 0;
      Rueda.Posicion += Limitar(Pixeles, -120, 120) / (this.Pixelesporcartel() * 1.6);
      this.Animarrueda();
      clearTimeout(this.Esperarueda);
      this.Esperarueda = setTimeout(() => {
        if (!this.Rueda) return;
        this.Rueda.Libre = false;
        this.Fijarobjetivo(Math.round(this.Rueda.Posicion));
      }, 140);
    }
  };
})();
