/* Constantes y datos iniciales del portafolio */
(function () {
  'use strict';

  var Titulos = {
    Inicio: { Texto: 'DEVELOPER', Clase: 'Palabragigante Rojo', Tamano: '' },
    Habilidades: { Texto: 'habilidades', Clase: 'Palabragigante Tinta', Tamano: 'min(12.4vw, 190px)' },
    Experiencia: { Texto: 'experiencia', Clase: 'Palabragigante Tinta', Tamano: 'min(12.4vw, 190px)' },
    Conoceme: { Texto: 'conóceme', Clase: 'Palabragigante Tinta', Tamano: 'min(14.4vw, 220px)' },
    Nissi: { Texto: 'Hotel Nissi', Clase: 'Palabragigante Tinta', Tamano: 'min(14.8vw, 218px)' },
    Mitecho: { Texto: 'MiTecho', Clase: 'Palabragigante Tinta', Tamano: 'min(17.5vw, 228px)' },
    Sonica: { Texto: 'Sónica', Clase: 'Palabragigante Tinta', Tamano: 'min(21.2vw, 240px)' },
    Neon: { Texto: 'Neon Jump', Clase: 'Palabragigante Tinta', Tamano: 'min(14.1vw, 216px)' },
    Moderador: { Texto: 'Moderador', Clase: 'Palabragigante Tinta', Tamano: 'min(12.8vw, 195px)' },
    Khronos: { Texto: 'Khronos', Clase: 'Palabragigante Tinta', Tamano: 'min(16.4vw, 226px)' }
  };

  var Tarjetas = [
    { Proyecto: 'Nissi', Titulo: 'Hotel Nissi', Tipo: 'Sitio web y Cotizador', Imagen: 'imagenes/icono-nissi.webp' },
    { Proyecto: 'Mitecho', Titulo: 'MiTecho', Tipo: 'App Financiera de Vivienda', Imagen: 'imagenes/icono-mitecho.webp' },
    { Proyecto: 'Neon', Titulo: 'Neon Jump', Tipo: 'Videojuego Móvil', Imagen: 'imagenes/icono-neon.webp' },
    { Proyecto: 'Sonica', Titulo: 'Sónica', Tipo: 'Podcasts con Inteligencia Artificial', Imagen: 'imagenes/icono-sonica.webp' },
    { Proyecto: 'Moderador', Titulo: 'Moderador', Tipo: 'Panel de Control y Gestión', Imagen: '' },
    { Proyecto: 'Khronos', Titulo: 'Khronos', Tipo: 'Planificador de Tareas, próximo a producción', Imagen: 'imagenes/Iconokhronos.webp' }
  ];

  var Capturas = { Nissi: 8, Mitecho: 6, Sonica: 3, Neon: 3, Moderador: 2, Khronos: 1 };

  var Pies = {
    Nissi: [
      'Portada principal y cotizador dinámico de noches',
      'Catálogo y detalle de habitaciones',
      'Ubicación estratégica sobre la Troncal del Caribe',
      'Infraestructura y servicios de descanso',
      'Atención y solicitud de reservas por WhatsApp',
      'Control de acceso con PIN a recepción',
      'Rack operativo de habitaciones en tiempo real',
      'Panel gerencial con métricas y rendimiento'
    ],
    Mitecho: [
      'Panel principal con cupo de vivienda, subsidio y meta de cuota inicial',
      'Simulador hipotecario con deudas reales y modalidades VIS, VIP y No VIS',
      'Cierre financiero, comparativa Pesos vs. UVR y certificado PDF',
      'Control de ingresos, gastos diarios y flujo mensual bancarizado',
      'Plan de liberación de cupo apagando deudas y proyectando ahorro',
      'Catálogo de proyectos inmobiliarios aliados según presupuesto y ciudad'
    ],
    Sonica: ['Inicio con serie destacada', 'Reproductor con forma de onda', 'Explorar por categorías'],
    Neon: ['Menú principal', 'Partida en curso', 'Ranking global'],
    Moderador: ['Panel principal con métricas', 'Series publicadas'],
    Khronos: ['Pantalla de inicio con video en bucle y acceso']
  };

  var Detalles = {
    Nissi: {
      Id: 'Nissi',
      Titulo: 'Hotel Nissi',
      Tamano: 'min(14.8vw, 218px)',
      Idtitulo: 'Titulonissi',
      Esimagen: true,
      Imagen: 'imagenes/icono-nissi.webp',
      Alticono: 'Ícono de Hotel Nissi',
      Dato: 'Web y Gestión Hotelera · La Guajira',
      Subtitulo: 'Sitio web oficial y sistema de reservas para el Hotel Nissi en Mingueo, La Guajira. Permite a los viajeros calcular el valor de su estadía en vivo y ayuda al hotel a registrar el ingreso de huéspedes en recepción.',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Hotel Nissi',
      Puntos: [
        { Num: '·', Texto: 'Construí la interfaz con JavaScript moderno y estilos visuales adaptables a cualquier pantalla, integrando etiquetas estructuradas de Schema para que buscadores como Google muestren el hotel en los primeros resultados.' },
        { Num: '·', Texto: 'Conecté la web con la API oficial de WhatsApp para confirmar solicitudes al instante y sumé la inteligencia artificial de Gemini para responder dudas frecuentes de los viajeros de forma automática.' },
        { Num: '·', Texto: 'Creé un servidor ligero con Google Apps Script que usa Google Sheets como base de datos en vivo, permitiendo al recepcionista ingresar con una clave segura, bloquear habitaciones ocupadas y enviar un balance diario al correo del administrador.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Web y Gestión hotelera' },
        { Clave: 'Stack', Valor: 'JavaScript · Apps Script · Google Sheets · Gemini AI · WhatsApp API' },
        { Clave: 'Alcance', Valor: 'Cotizador en vivo y panel de recepción' }
      ],
      Accion: { Url: 'https://hotel-nissi-mingueo.web.app', Texto: 'Ir a Hotel Nissi' },
      Dispositivo: 'portal',
      Capturas: [
        { Src: 'imagenes/nissi-1.webp', Alt: 'Portada principal de Hotel Nissi con cotizador de noches' },
        { Src: 'imagenes/nissi-2.webp', Alt: 'Catálogo y detalle de habitaciones' },
        { Src: 'imagenes/nissi-3.webp', Alt: 'Ubicación sobre la Troncal del Caribe' },
        { Src: 'imagenes/nissi-4.webp', Alt: 'Infraestructura y servicios de descanso' },
        { Src: 'imagenes/nissi-5.webp', Alt: 'Atención y solicitud de reservas por WhatsApp' },
        { Src: 'imagenes/nissi-6.webp', Alt: 'Control de acceso con PIN a recepción' },
        { Src: 'imagenes/nissi-7.webp', Alt: 'Rack operativo de habitaciones en tiempo real' },
        { Src: 'imagenes/nissi-8.webp', Alt: 'Panel gerencial con métricas y rendimiento' }
      ],
      Anterior: { Proyecto: 'Khronos', Nombre: 'Khronos' },
      Siguiente: { Proyecto: 'Mitecho', Nombre: 'MiTecho' }
    },
    Mitecho: {
      Id: 'Mitecho',
      Titulo: 'MiTecho',
      Tamano: 'min(17.5vw, 228px)',
      Idtitulo: 'Titulomitecho',
      Esimagen: true,
      Imagen: 'imagenes/icono-mitecho.webp',
      Alticono: 'Ícono de la aplicación MiTecho',
      Dato: 'Aplicación Móvil · Finanzas y Vivienda',
      Subtitulo: 'Aplicación móvil para Android e iOS que ayuda a las familias en Colombia a calcular su capacidad de crédito para comprar casa, evaluar subsidios del gobierno y planear su ahorro.',
      Etiquetapuntos: 'Cómo funciona y tecnologías de MiTecho',
      Puntos: [
        { Num: '·', Texto: 'Desarrollé la aplicación con un motor propio en JavaScript y la empaqueté para celulares usando Capacitor, agregando código nativo en Java con cifrado bancario de alta seguridad y bloqueo de capturas de pantalla para proteger los datos financieros del usuario.' },
        { Num: '·', Texto: 'Implementé la base de datos en Supabase con PostgreSQL y creé funciones automáticas en la nube para consultar a diario las tasas de interés reales de los bancos en el portal de la Superfinanciera de Colombia.' },
        { Num: '·', Texto: 'Programé el simulador para comparar créditos en pesos frente a unidades UVR, sumando los subsidios de las cajas de compensación y del programa Mi Casa Ya, para luego generar en el celular un certificado financiero descargable de tres páginas en formato PDF.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Aplicación móvil para Android e iOS' },
        { Clave: 'Stack', Valor: 'JavaScript · Capacitor · Java · Supabase · PostgreSQL · Deno' },
        { Clave: 'Alcance', Valor: 'Simulador de crédito · Subsidios · Certificado en PDF' }
      ],
      Accion: null,
      Dispositivo: 'movil',
      Capturas: [
        { Src: 'imagenes/mitecho-1.webp', Alt: 'Panel principal de MiTecho con cupo de vivienda, subsidio de Caja y progreso de cuota inicial' },
        { Src: 'imagenes/mitecho-2.webp', Alt: 'Simulador hipotecario de MiTecho con ingresos, deudas y modalidades de vivienda' },
        { Src: 'imagenes/mitecho-3.webp', Alt: 'Resultado de cierre financiero de MiTecho con comparativa Pesos vs. UVR y descarga de certificado PDF' },
        { Src: 'imagenes/mitecho-4.webp', Alt: 'Control mensual de ingresos, gastos y flujo bancarizado en MiTecho' },
        { Src: 'imagenes/mitecho-5.webp', Alt: 'Plan de liberación de cupo crediticio apagando deudas en MiTecho' },
        { Src: 'imagenes/mitecho-6.webp', Alt: 'Catálogo de proyectos inmobiliarios aliados por municipio en MiTecho' }
      ],
      Anterior: { Proyecto: 'Nissi', Nombre: 'Hotel Nissi' },
      Siguiente: { Proyecto: 'Neon', Nombre: 'Neon Jump' }
    },
    Neon: {
      Id: 'Neon',
      Titulo: 'Neon Jump',
      Tamano: 'min(14.1vw, 216px)',
      Idtitulo: 'Tituloneon',
      Esimagen: true,
      Imagen: 'imagenes/icono-neon.webp',
      Alticono: 'Ícono del juego Neon Jump',
      Dato: 'Videojuego Móvil · Google Play',
      Subtitulo: 'Videojuego móvil de saltos infinitos con estilo visual retro neón y tabla de posiciones mundial en tiempo real, publicado y disponible en la tienda Google Play.',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Neon Jump',
      Puntos: [
        { Num: '·', Texto: 'Programé el juego en el lenguaje Dart usando Flutter y el motor especializado Flame Engine, con un sistema que crea plataformas infinitas al azar y recicla elementos en memoria para que la partida funcione con total fluidez en pantallas de 60, 90 y 120 hercios.' },
        { Num: '·', Texto: 'Integré los servicios de Firebase para permitir el inicio de sesión con cuentas de Google y creé una base de datos en Cloud Firestore que actualiza en vivo la tabla de los mejores cincuenta jugadores del mundo.' },
        { Num: '·', Texto: 'Protegí los puntajes y monedas contra intentos de trampa ofuscando los números en la memoria del dispositivo, guardé la partida con llaves cifradas e integré anuncios de Google AdMob que permiten al jugador revivir tras ver un video publicitario.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Videojuego móvil en dos dimensiones' },
        { Clave: 'Stack', Valor: 'Flutter · Dart · Flame Engine · Firebase · AdMob' },
        { Clave: 'Tienda', Valor: 'Google Play Store' }
      ],
      Accion: { Url: 'https://play.google.com/store/apps/details?id=com.tustudio.neon%5Fjump', Texto: 'Ver en Google Play' },
      Dispositivo: 'movil',
      Capturas: [
        { Src: 'imagenes/neon-1.webp', Alt: 'Menú principal de Neon Jump' },
        { Src: 'imagenes/neon-2.webp', Alt: 'Partida en curso de Neon Jump' },
        { Src: 'imagenes/neon-3.webp', Alt: 'Ranking global de Neon Jump' }
      ],
      Anterior: { Proyecto: 'Mitecho', Nombre: 'MiTecho' },
      Siguiente: { Proyecto: 'Sonica', Nombre: 'Sónica App de Podcasts' }
    },
    Sonica: {
      Id: 'Sonica',
      Titulo: 'Sónica',
      Tamano: 'min(21.2vw, 240px)',
      Idtitulo: 'Titulosonica',
      Esimagen: true,
      Imagen: 'imagenes/icono-sonica.webp',
      Alticono: 'Ícono de la aplicación Sónica',
      Dato: 'Web y Aplicación Móvil · Podcasts con IA',
      Subtitulo: 'Plataforma web y móvil para crear y escuchar podcasts con inteligencia artificial, combinando voces realistas entre varios personajes, música de ambiente y efectos sonoros.',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Sónica',
      Puntos: [
        { Num: '·', Texto: 'Construí la aplicación con JavaScript modular moderno y Tailwind CSS sin depender de librerías pesadas, empaquetándola para celulares con Capacitor y Java nativo para lograr tiempos de carga instantáneos y navegación táctil fluida.' },
        { Num: '·', Texto: 'Desarrollé un motor de audio continuo con un reproductor flotante que no interrumpe la música al explorar el catálogo, permitiendo abrir una pantalla inmersiva que dibuja la onda sonora y reacciona al tacto del usuario.' },
        { Num: '·', Texto: 'Integré Firebase para gestionar usuarios y streaming en vivo, sumando las voces sintéticas de ElevenLabs para dar vida a los personajes de las audioseries con diferentes emociones y un panel de creador para subir capítulos y revisar métricas.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Plataforma web y aplicación móvil' },
        { Clave: 'Stack', Valor: 'JavaScript · Java · Capacitor · Tailwind CSS · Firebase · ElevenLabs' },
        { Clave: 'Alcance', Valor: 'Podcasts con voces sintéticas y reproductor continuo' }
      ],
      Accion: { Url: 'https://sónica.com', Texto: 'Ir a Sónica' },
      Dispositivo: 'movil',
      Capturas: [
        { Src: 'imagenes/sonica-1.webp', Alt: 'Pantalla de inicio de Sónica con la serie destacada y episodios para seguir escuchando' },
        { Src: 'imagenes/sonica-2.webp', Alt: 'Reproductor de Sónica con la forma de onda del episodio y los controles' },
        { Src: 'imagenes/sonica-3.webp', Alt: 'Categorías populares en la sección Explorar de Sónica' }
      ],
      Anterior: { Proyecto: 'Neon', Nombre: 'Neon Jump' },
      Siguiente: { Proyecto: 'Moderador', Nombre: 'Sónica Moderador' }
    },
    Moderador: {
      Id: 'Moderador',
      Titulo: 'Moderador',
      Prefijo: 'Sónica ',
      Tamano: 'min(12.8vw, 195px)',
      Idtitulo: 'Titulomoderador',
      Esimagen: false,
      Esmoderador: true,
      Dato: 'Panel de Control · Moderación y Calidad',
      Subtitulo: 'Panel de administración en tiempo real que permite al equipo de trabajo revisar episodios, aprobar o rechazar series y asegurar la calidad del contenido publicado en Sónica.',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Sónica Moderador',
      Puntos: [
        { Num: '·', Texto: 'Diseñé la interfaz con JavaScript modular en estándares modernos y Tailwind CSS sobre Vite, logrando un panel administrativo ultraligero que inicia en milisegundos y prescinde de sobrecargas de librerías externas.' },
        { Num: '·', Texto: 'Conecté el sistema directamente a Cloud Firestore con suscripciones reactivas, actualizando en la pantalla las series, los capítulos subidos y los reportes de la comunidad en el mismo instante en que suceden sin recargar el navegador.' },
        { Num: '·', Texto: 'Configuré la autenticación de Firebase con permisos exclusivos para moderadores y administradores, incorporando una bitácora protegida que guarda cada aprobación o rechazo de contenido para asegurar máxima transparencia.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Panel de administración y control en vivo' },
        { Clave: 'Stack', Valor: 'JavaScript · Tailwind CSS · Vite · Firebase · Cloud Firestore' },
        { Clave: 'Alcance', Valor: 'Moderación en vivo y bitácora de auditoría' }
      ],
      Accion: { Url: 'https://sonica-moderador-client.web.app/#/login', Texto: 'Ir a Sónica Moderador' },
      Dispositivo: 'portal',
      Capturas: [
        { Src: 'imagenes/moderador-1.webp', Alt: 'Panel principal de Sónica Moderador con métricas de moderación' },
        { Src: 'imagenes/moderador-2.webp', Alt: 'Sección Series publicadas del panel Sónica Moderador' }
      ],
      Anterior: { Proyecto: 'Sonica', Nombre: 'Sónica App de Podcasts' },
      Siguiente: { Proyecto: 'Khronos', Nombre: 'Khronos' }
    },
    Khronos: {
      Id: 'Khronos',
      Titulo: 'Khronos',
      Tamano: 'min(16.4vw, 226px)',
      Idtitulo: 'Titulokhronos',
      Esimagen: true,
      Esproximo: true,
      Imagen: 'imagenes/Iconokhronos.webp',
      Alticono: 'Isotipo de Khronos, una K que también es un reloj de arena',
      Dato: 'Aplicación Web · Planificador de Tareas',
      Subtitulo: 'Planificador de tareas para equipos de trabajo',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Khronos',
      Puntos: [
        { Num: '·', Texto: 'Diseñé una entrada cinematográfica con video en bucle de una pared iluminada por un reloj de arena; al iniciar sesión, un segundo video hace la transición hasta el panel sin saltos de color, y el isotipo es una K que a la vez funciona como reloj de arena.' },
        { Num: '·', Texto: 'Armé el tablero con HTML, Bootstrap y JavaScript: las tarjetas se arrastran entre Por hacer, En proceso, Revisión y Hecho, el formulario valida cada campo antes de guardar y todo queda en el localStorage del navegador.' },
        { Num: '·', Texto: 'Ya funcionan el acceso de prueba, el menú lateral y el tablero con su administrador de tareas; lo que sigue es el registro de usuarios reales, los equipos de trabajo, el calendario y el chat antes de salir a producción.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Aplicación web de gestión de tareas' },
        { Clave: 'Stack', Valor: 'HTML · CSS · Bootstrap · JavaScript · localStorage · Firebase Hosting' },
        { Clave: 'Estado', Valor: 'En construcción, con la pantalla de inicio terminada' }
      ],
      Accion: { Url: 'https://khronos-co.web.app', Texto: 'Ir a Khronos' },
      Dispositivo: 'portal',
      Capturas: [
        { Src: 'imagenes/Khronosinicio.webp', Alt: 'Pantalla de inicio de Khronos con el lema Domina tu tiempo, conquista tus proyectos, una figura frente a un reloj de arena iluminado y el formulario de acceso' }
      ],
      Anterior: { Proyecto: 'Moderador', Nombre: 'Sónica Moderador' },
      Siguiente: { Proyecto: 'Nissi', Nombre: 'Hotel Nissi' }
    }
  };

  var Estadobase = {
    Pantalla: 'Inicio',
    Saliendo: false,
    Llegando: false,
    Llegada: false,
    Regreso: false,
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

  window.Datosportafolio = window.Validaciones.Congelar({
    Titulos: Titulos,
    Tarjetas: Tarjetas,
    Capturas: Capturas,
    Pies: Pies,
    Detalles: Detalles,
    Estadobase: Estadobase
  });
})();
