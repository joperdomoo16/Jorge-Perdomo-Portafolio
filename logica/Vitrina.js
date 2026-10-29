/* Portafolio de Jorge David Perdomo
   Módulo de la vitrina interactiva 3D: carrusel tridimensional, física de inclinación y gestos táctiles
*/
(function () {
  'use strict';

  window.MetodosVitrina = {
    Girarcartel(Paso) {
      const Total = this.Tarjetas.length;
      this.Nodostarjeta.forEach((N) => { if (N) this.Limpiarcartel(N); });
      this.Fijarestado((Previo) => ({ Proyecto: ((((Previo.Proyecto || 0) + Paso) % Total) + Total) % Total }));
    },

    Pulsarcartel(Indice) {
      if (this.Arrastradocartel) { this.Arrastradocartel = false; return; }
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      this.Nodostarjeta.forEach((N) => { if (N) this.Limpiarcartel(N); });
      if ((Estado.Proyecto || 0) !== Indice) { this.Fijarestado({ Proyecto: Indice }); return; }
      this.Abrirproyecto(Indice);
    },

    Inclinarcartel(Indice, Evento) {
      if (this.Movimientoreducido() || Evento.pointerType === 'touch') return;
      const Nodo = this.Nodostarjeta[Indice];
      if (!Nodo) return;
      const Caja = Nodo.getBoundingClientRect();
      if (!Caja.width || !Caja.height) return;
      const Nx = Math.max(-1, Math.min(1, ((Evento.clientX - Caja.left) / Caja.width - 0.5) * 2));
      const Ny = Math.max(-1, Math.min(1, ((Evento.clientY - Caja.top) / Caja.height - 0.5) * 2));
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

    Empezarcartel(Evento) {
      if (Evento.button && Evento.button !== 0) return;
      this.Arrastrecartel = { X: Evento.clientX, Y: Evento.clientY, Movido: false };
      this.Arrastradocartel = false;
    },

    Movercartel(Evento) {
      if (!this.Arrastrecartel) return;
      const Dx = Evento.clientX - this.Arrastrecartel.X;
      const Dy = Evento.clientY - this.Arrastrecartel.Y;
      if (Math.abs(Dx) > 8 && Math.abs(Dx) > Math.abs(Dy)) this.Arrastrecartel.Movido = true;
    },

    Soltarcartel(Evento) {
      if (!this.Arrastrecartel) return;
      const Dx = Evento.clientX - this.Arrastrecartel.X;
      const Movido = this.Arrastrecartel.Movido && Math.abs(Dx) > 34;
      this.Arrastrecartel = null;
      if (Movido) {
        this.Arrastradocartel = true;
        this.Girarcartel(Dx < 0 ? 1 : -1);
      }
    },

    Cancelarcartel() {
      this.Arrastrecartel = null;
    },

    Teclascartel(Evento) {
      const Teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!Teclas[Evento.key]) return;
      Evento.preventDefault();
      this.Girarcartel(Teclas[Evento.key]);
    }
  };
})();

