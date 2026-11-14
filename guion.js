/* Portafolio de Jorge David Perdomo
   Controlador principal y orquestador del portafolio en JavaScript puro
*/
(function () {
  'use strict';

  var Validaciones = window.Validaciones;
  var Ordinales = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho'];

  class Portafolio {
    constructor(Raiz) {
      this.Raiz = Raiz;
      this.Vista = {};
      this.Nodosref = Object.create(null);
      this.Trozos = new Map();
      this.Preparar();
      this.Estado = Validaciones.Sanearestado(window.Datosportafolio.Estadobase, this.Titulos, this.Tarjetas.length);
    }

    Movimientoreducido() {
      return window.Utilidades.Movimientoreducido();
    }

    Esperar(Milisegundos, Accion) {
      const Demora = Validaciones.Numeroacotado(Milisegundos, 0, 60000, 0);
      const Id = setTimeout(() => {
        this.Temporizadores = this.Temporizadores.filter((Otro) => Otro !== Id);
        Accion();
      }, Demora);
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
      this.Detalles = window.Datosportafolio.Detalles;

      this.Nodostitulo = Object.create(null);
      this.Nodosicono = Object.create(null);
      this.Fijartitulo = {};
      this.Fijaricono = {};

      Object.keys(this.Titulos).forEach((Id) => {
        this.Fijartitulo[Id] = (Nodo) => { this.Nodostitulo[Id] = Nodo; };
        this.Fijaricono[Id] = (Nodo) => { this.Nodosicono[Id] = Nodo; };
      });

      this.Fijartituloproyecto = (Nodo) => {
        const Pantalla = this.Estado && this.Estado.Pantalla;
        if (Pantalla && Validaciones.Espropio(this.Fijartitulo, Pantalla)) this.Fijartitulo[Pantalla](Nodo);
      };
      this.Fijariconoproyecto = (Nodo) => {
        const Pantalla = this.Estado && this.Estado.Pantalla;
        if (Pantalla && Validaciones.Espropio(this.Fijaricono, Pantalla)) this.Fijaricono[Pantalla](Nodo);
      };

      const Totalcarteles = this.Tarjetas.length;
      this.Nodostarjeta = new Array(Totalcarteles).fill(null);
      const Indices = this.Tarjetas.map((_, Indice) => Indice);
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

      this.Nodosllamada = Object.create(null);
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
      const Pantalla = Validaciones.Espropio(this.Titulos, Estado.Pantalla) ? Estado.Pantalla : 'Inicio';
      const Nav = { Mostrarinicio: Pantalla !== 'Inicio' };

      Object.keys(this.Titulos).forEach((Id) => {
        const Activo = Pantalla === Id;
        Nav[Id] = { Clase: 'Enlacenav Conrodillo' + (Activo ? ' Activo' : ''), Actual: Activo ? 'page' : 'false', Ir: this.Ira[Id] };
      });

      const Totalcarteles = this.Tarjetas.length;
      const Activo = Validaciones.Enteromodulo(Estado.Proyecto, Totalcarteles);
      const Mitad = Math.floor(Totalcarteles / 2);
      const Cartelinfo = (Indice) => {
        const Puesto = Validaciones.Enteromodulo(Indice - Activo + Mitad, Totalcarteles) - Mitad;
        const Escentro = Puesto === 0;
        const Datos = this.Tarjetas[Indice];
        const Visible = Math.abs(Puesto) <= 1;
        return {
          Clase: 'Cartel' + (Escentro ? ' Activo' : ' Lateral') + (Visible ? '' : ' Oculto'),
          Pulsar: this.Pulsarcarteles[Indice],
          Fijar: this.Fijarcartel[Indice],
          Inclinar: this.Inclinarcarteles[Indice],
          Reposo: this.Reposocarteles[Indice],
          Etiqueta: (Escentro ? 'Abrir ' : 'Ver ') + Datos.Titulo + ', ' + Datos.Tipo
        };
      };

      const Total = Validaciones.Espropio(this.Capturas, Pantalla) ? this.Capturas[Pantalla] : 3;
      const Pilasegura = Number.isFinite(Estado.Pila) ? Math.trunc(Estado.Pila) : 0;
      const Activa = Validaciones.Enteromodulo(Pilasegura, Total);
      const Posiciones = Total === 2 ? ['Frente', 'Fondo'] : ['Frente', 'Medio', 'Fondo'];
      const Clasepila = (Orden) => {
        if (Orden >= Total) return '';
        const Lugar = Posiciones[Validaciones.Enteromodulo(Orden - Activa, Total)];
        const Recien = Pilasegura > 0 && Orden === Validaciones.Enteromodulo(Activa - 1, Total);
        return Lugar + (Recien ? ' Recien' : '');
      };

      const Tapaabierta = !!Estado.Portatilabierto;
      const Palabra = Estado.Palabra;
      const Vuelo = Estado.Vuelo;
      const Fasecontacto = Validaciones.Validarfasecontacto(Estado.Contacto);
      const Esunproyecto = Validaciones.Espropio(this.Detalles, Pantalla);
      const Detalle = Esunproyecto ? this.Detalles[Pantalla] : null;

      const Proyectovista = {
        Fijartitulo: this.Fijartituloproyecto,
        Fijaricono: this.Fijariconoproyecto
      };

      if (Detalle) {
        const Puntos = Detalle.Puntos || [];
        const Ficha = Detalle.Ficha || [];
        const Capturas = Detalle.Capturas || [];
        const Totaldiapos = Capturas.length;
        const Diaposinfo = {};

        Ordinales.forEach((Sufijo, Indice) => {
          const Cap = Capturas[Indice];
          Diaposinfo['Diapo' + Sufijo] = {
            Visible: !!Cap,
            Src: Cap ? Validaciones.Validarimagen(Cap.Src) : '',
            Alt: Cap ? Cap.Alt : ''
          };
          Diaposinfo['Punto' + Sufijo] = {
            Visible: Indice < Totaldiapos
          };
        });

        Object.assign(Proyectovista, {
          Id: Detalle.Id,
          Titulo: Detalle.Titulo,
          Prefijooculto: Detalle.Prefijo || '',
          Estilotamano: Validaciones.Validartamano(Detalle.Tamano),
          Idtitulo: Detalle.Idtitulo,
          Esimagen: !!Detalle.Esimagen,
          Esmoderador: !!Detalle.Esmoderador,
          Esproximo: !!Detalle.Esproximo,
          Imagen: Validaciones.Validarimagen(Detalle.Imagen),
          Alticono: Detalle.Alticono || '',
          Metadato: Detalle.Dato,
          Subtitulo: Detalle.Subtitulo,
          Etiquetapuntos: Detalle.Etiquetapuntos,
          Puntounonum: Puntos[0] ? Puntos[0].Num : '',
          Puntounotexto: Puntos[0] ? Puntos[0].Texto : '',
          Puntodosnum: Puntos[1] ? Puntos[1].Num : '',
          Puntodostexto: Puntos[1] ? Puntos[1].Texto : '',
          Puntotresnum: Puntos[2] ? Puntos[2].Num : '',
          Puntotrestexto: Puntos[2] ? Puntos[2].Texto : '',
          Fichaunoclave: Ficha[0] ? Ficha[0].Clave : '',
          Fichaunovalor: Ficha[0] ? Ficha[0].Valor : '',
          Fichadosclave: Ficha[1] ? Ficha[1].Clave : '',
          Fichadosvalor: Ficha[1] ? Ficha[1].Valor : '',
          Tienefichatres: !!Ficha[2],
          Fichatresclave: Ficha[2] ? Ficha[2].Clave : '',
          Fichatresvalor: Ficha[2] ? Ficha[2].Valor : '',
          Tieneenlace: !!Detalle.Accion,
          Url: Detalle.Accion ? Validaciones.Validarenlace(Detalle.Accion.Url, 'href') : '#',
          Textoboton: Detalle.Accion ? Detalle.Accion.Texto : '',
          Esmovil: Detalle.Dispositivo === 'movil',
          Esportal: Detalle.Dispositivo === 'portal',
          Pasoanterior: Detalle.Anterior && Validaciones.Espropio(this.Ira, Detalle.Anterior.Proyecto) ? this.Ira[Detalle.Anterior.Proyecto] : null,
          Nombreanterior: Detalle.Anterior ? Detalle.Anterior.Nombre : '',
          Pasosiguiente: Detalle.Siguiente && Validaciones.Espropio(this.Ira, Detalle.Siguiente.Proyecto) ? this.Ira[Detalle.Siguiente.Proyecto] : null,
          Nombresiguiente: Detalle.Siguiente ? Detalle.Siguiente.Nombre : ''
        }, Diaposinfo);
      }

      const Carruselvista = {
        Estilo: 'transform: translateX(-' + (Activa * 100) + '%)',
        Etiqueta: String(Activa + 1).padStart(2, '0') + ' / ' + String(Total).padStart(2, '0'),
        Pie: (Validaciones.Espropio(this.Pies, Pantalla) ? this.Pies[Pantalla][Activa] : '') || '',
        Anterior: this.Capturaanterior,
        Siguiente: this.Capturasiguiente
      };
      Ordinales.forEach((Sufijo, Indice) => {
        Carruselvista['Punto' + Sufijo] = 'Puntomovil' + (Activa === Indice ? ' Activo' : '');
      });

      const Imagenvuelo = Vuelo && Vuelo.Imagen ? Validaciones.Validarimagen(Vuelo.Imagen) : '';

      return {
        Raiz: { Clase: 'Raiz' },
        Capa: { Fondooculto: Fasecontacto ? 'true' : 'false' },
        Clases: { Pantalla: 'Pantalla' + (Estado.Saliendo ? ' Saliendo' : '') + (Estado.Llegando ? ' Llegando' : '') + (Estado.Llegada ? ' Llegada' : '') + (Estado.Regreso ? ' Regreso' : '') },
        Ver: {
          Inicio: Pantalla === 'Inicio',
          Habilidades: Pantalla === 'Habilidades',
          Experiencia: Pantalla === 'Experiencia',
          Conoceme: Pantalla === 'Conoceme',
          Proyecto: Esunproyecto
        },
        Proyecto: Proyectovista,
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
          Cinco: Cartelinfo(4),
          Seis: Cartelinfo(5),
          Cuenta: String(Activo + 1).padStart(2, '0') + ' / ' + String(Totalcarteles).padStart(2, '0'),
          Teclas: this.Teclascarteles,
          Anterior: this.Cartelanterior,
          Siguiente: this.Cartelsiguiente,
          Rueda: this.Fijarrueda,
          Esfera: this.Fijaresfera
        },
        Proyectos: { Nissi: this.Ira.Nissi, Mitecho: this.Ira.Mitecho, Sonica: this.Ira.Sonica, Neon: this.Ira.Neon, Moderador: this.Ira.Moderador, Khronos: this.Ira.Khronos },
        Pila: {
          Uno: Clasepila(0),
          Dos: Clasepila(1),
          Tres: Clasepila(2),
          Contador: (Activa + 1) + ' / ' + Total,
          Barajar: this.Barajar
        },
        Carrusel: Carruselvista,
        Portal: {
          Clase: 'Portatil' + (Tapaabierta ? ' Abierto' : '') + (Total === 1 ? ' Unacaptura' : ''),
          Alternar: this.Alternartapa,
          Abierta: Tapaabierta ? 'true' : 'false',
          Etiqueta: Tapaabierta ? 'Cerrar el portátil' : 'Abrir el portátil para ver las capturas'
        },
        Palabra: {
          Visible: !!Palabra,
          Texto: Palabra ? Palabra.Texto : '',
          Clase: Palabra ? Validaciones.Validarclasepalabra(Palabra.Clase) : 'Palabragigante',
          Estilo: Palabra && Palabra.Tamano ? Validaciones.Validartamano(Palabra.Tamano) : '',
          Clasecontenedor: 'Palabraflotante' + (this.Palabracrece ? ' Lista Crece' : (this.Palabralista ? ' Lista' : '')),
          Fijar: this.Fijarpalabra
        },
        Vuelo: {
          Visible: !!Vuelo,
          Esimagen: !!(Vuelo && !Vuelo.Moderador && Imagenvuelo),
          Esmoderador: !!(Vuelo && Vuelo.Moderador),
          Estiloimagen: Imagenvuelo ? 'background-image: url(' + Imagenvuelo + ')' : '',
          Fijar: this.Fijarvuelo
        },
        Contacto: {
          Visible: !!Fasecontacto,
          Clase: 'Contacto' + (Fasecontacto ? ' ' + Fasecontacto : '') + (Estado.Textosllamada ? ' Textosvisibles' : ''),
          X: Math.round(Validaciones.Numeroacotado(Estado.Origenx, -10000, 10000, 0)),
          Y: Math.round(Validaciones.Numeroacotado(Estado.Origeny, -10000, 10000, 0)),
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

  Object.assign(
    Portafolio.prototype,
    window.Metodostransiciones,
    window.Metodosvitrina,
    window.Metodosllamada
  );

  window.Motorreactivo.Aplicar(Portafolio.prototype);

  var Aplicacion = new Portafolio(document.body);
  try {
    Aplicacion.Pintar();
    Aplicacion.Escuchar();
    Aplicacion.Montar();
  } finally {
    document.body.classList.remove('Cargando');
  }
})();
