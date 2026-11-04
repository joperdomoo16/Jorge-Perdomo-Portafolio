/* Portafolio de Jorge David Perdomo
   Controlador principal y orquestador del portafolio (Vanilla JS sin frameworks)
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

      const Totalcarteles = this.Tarjetas.length;
      this.Nodostarjeta = new Array(Totalcarteles).fill(null);
      const Indices = this.Tarjetas.map((_, I) => I);
      this.Fijarcartel = Indices.map((Indice) => (Nodo) => { this.Nodostarjeta[Indice] = Nodo; });
      this.Pulsarcarteles = Indices.map((Indice) => () => this.Pulsarcartel(Indice));
      this.Inclinarcarteles = Indices.map((Indice) => (Evento) => this.Inclinarcartel(Indice, Evento));
      this.Reposocarteles = Indices.map((Indice) => () => this.Reposocartel(Indice));
      this.Cartelanterior = () => this.Girarcartel(-1);
      this.Cartelsiguiente = () => this.Girarcartel(1);
      this.Teclascarteles = (Evento) => this.Teclascartel(Evento);
      this.Fijarrueda = (Nodo) => this.Montarrueda(Nodo);
      this.Fijaresfera = (Nodo) => this.Montaresfera(Nodo);

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
        if (this.Nodorueda) this.Colocarrueda();
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
      if (this.Cuadrorueda) cancelAnimationFrame(this.Cuadrorueda);
      clearTimeout(this.Esperarueda);
      if (this.Cuadrollamada) cancelAnimationFrame(this.Cuadrollamada);
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
        let Puesto = Indice - Activo;
        while (Puesto > Totalcarteles / 2) Puesto -= Totalcarteles;
        while (Puesto < -Totalcarteles / 2) Puesto += Totalcarteles;
        const Escentro = Puesto === 0;
        const Datos = this.Tarjetas[Indice];
        const Visible = Math.abs(Puesto) <= 1;
        // La posición, giro y escala de cada tarjeta los dibuja la rueda (Vitrina.js) cuadro a cuadro
        return {
          Clase: 'Cartel' + (Escentro ? ' Activo' : ' Lateral') + (Visible ? '' : ' Oculto'),
          Pulsar: this.Pulsarcarteles[Indice],
          Fijar: this.Fijarcartel[Indice],
          Inclinar: this.Inclinarcarteles[Indice],
          Reposo: this.Reposocarteles[Indice],
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
          Nissi: Pantalla === 'Nissi',
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
          Cuatro: Cartelinfo(3),
          Cuenta: String(Activo + 1).padStart(2, '0') + ' / ' + String(Totalcarteles).padStart(2, '0'),
          Teclas: this.Teclascarteles,
          Anterior: this.Cartelanterior,
          Siguiente: this.Cartelsiguiente,
          Rueda: this.Fijarrueda,
          Esfera: this.Fijaresfera
        },
        Proyectos: { Nissi: this.Ira.Nissi, Sonica: this.Ira.Sonica, Neon: this.Ira.Neon, Moderador: this.Ira.Moderador },
        Pila: {
          Uno: Clasepila(0),
          Dos: Clasepila(1),
          Tres: Clasepila(2),
          Contador: (Activa + 1) + ' / ' + Total,
          Barajar: this.Barajar
        },
        Carrusel: Object.assign({
          Estilo: 'transform: translateX(-' + (Activa * 100) + '%)',
          Etiqueta: String(Activa + 1).padStart(2, '0') + ' / ' + String(Total).padStart(2, '0'),
          Puntouno: 'Puntomovil' + (Activa === 0 ? ' Activo' : ''),
          Puntodos: 'Puntomovil' + (Activa === 1 ? ' Activo' : ''),
          Puntotres: 'Puntomovil' + (Activa === 2 ? ' Activo' : ''),
          Pie: (this.Pies[Pantalla] || [])[Activa] || '',
          Anterior: this.Capturaanterior,
          Siguiente: this.Capturasiguiente
        }, ...Array.from({ length: 8 }, (_, i) => ({ ['Punto' + (i + 1)]: 'Puntomovil' + (Activa === i ? ' Activo' : '') }))),
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
          Estilo: Palabra && Palabra.Tamano ? '--Tamano: ' + Palabra.Tamano : '',
          Clasecontenedor: 'Palabraflotante' + (this.Palabracrece ? ' Lista Crece' : (this.Palabralista ? ' Lista' : '')),
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

  // Integrar módulos funcionales al prototipo
  Object.assign(
    Portafolio.prototype,
    window.MetodosTransiciones,
    window.MetodosVitrina,
    window.MetodosLlamada
  );

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
