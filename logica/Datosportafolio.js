/* Constantes y datos iniciales del portafolio */
(function () {
  'use strict';

  var Titulos = {
    Inicio: { Texto: 'DEVELOPER', Clase: 'Palabragigante Rojo', Tamano: '' },
    Habilidades: { Texto: 'habilidades', Clase: 'Palabragigante Tinta', Tamano: 'min(12.4vw, 190px)' },
    Experiencia: { Texto: 'experiencia', Clase: 'Palabragigante Tinta', Tamano: 'min(12.4vw, 190px)' },
    Conoceme: { Texto: 'conóceme', Clase: 'Palabragigante Tinta', Tamano: 'min(14.4vw, 220px)' },
    Sonica: { Texto: 'Sónica', Clase: 'Palabragigante Tinta', Tamano: 'min(21.2vw, 240px)' },
    Neon: { Texto: 'Neon Jump', Clase: 'Palabragigante Tinta', Tamano: 'min(14.1vw, 216px)' },
    Moderador: { Texto: 'Moderador', Clase: 'Palabragigante Tinta', Tamano: 'min(12.8vw, 195px)' }
  };

  var Tarjetas = [
    { Proyecto: 'Neon', Titulo: 'Neon Jump', Tipo: 'Juego móvil', Imagen: 'imagenes/icono-neon.webp' },
    { Proyecto: 'Sonica', Titulo: 'Sónica', Tipo: 'app de podcasts', Imagen: 'imagenes/icono-sonica.webp' },
    { Proyecto: 'Moderador', Titulo: 'Moderador', Tipo: 'BackOffice', Imagen: '' }
  ];

  var Capturas = { Sonica: 3, Neon: 3, Moderador: 2 };

  var Pies = {
    Sonica: ['Inicio con serie destacada', 'Reproductor con forma de onda', 'Explorar por categorías'],
    Neon: ['Menú principal', 'Partida en curso', 'Ranking global'],
    Moderador: ['Panel principal con métricas', 'Series publicadas']
  };

  var Estadobase = {
    Pantalla: 'Inicio',
    Saliendo: false,
    Llegando: false,
    Palabra: null,
    Vuelo: null,
    Contacto: '',
    Textosllamada: false,
    Origenx: 0,
    Origeny: 0,
    Menuabierto: false,
    Copiado: false,
    Foco: -1,
    Pila: 0,
    Proyecto: 0,
    Portatilabierto: false
  };

  window.Datosportafolio = {
    Titulos: Titulos,
    Tarjetas: Tarjetas,
    Capturas: Capturas,
    Pies: Pies,
    Estadobase: Estadobase
  };
})();
