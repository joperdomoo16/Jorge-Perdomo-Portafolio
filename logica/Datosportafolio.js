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
    Moderador: { Texto: 'Moderador', Clase: 'Palabragigante Tinta', Tamano: 'min(12.8vw, 195px)' }
  };

  var Tarjetas = [
    { Proyecto: 'Nissi', Titulo: 'Hotel Nissi', Tipo: 'Sitio web & Cotizador', Imagen: 'imagenes/icono-nissi.webp' },
    { Proyecto: 'Mitecho', Titulo: 'MiTecho', Tipo: 'App FinTech & Vivienda', Imagen: 'imagenes/icono-mitecho.webp' },
    { Proyecto: 'Neon', Titulo: 'Neon Jump', Tipo: 'Juego móvil', Imagen: 'imagenes/icono-neon.webp' },
    { Proyecto: 'Sonica', Titulo: 'Sónica', Tipo: 'app de podcasts', Imagen: 'imagenes/icono-sonica.webp' },
    { Proyecto: 'Moderador', Titulo: 'Moderador', Tipo: 'BackOffice', Imagen: '' }
  ];

  var Capturas = { Nissi: 8, Mitecho: 6, Sonica: 3, Neon: 3, Moderador: 2 };

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
    Moderador: ['Panel principal con métricas', 'Series publicadas']
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
      Dato: 'Proyecto 01 / 05 · Web & Cotizador · La Guajira',
      Subtitulo: 'Sitio web oficial y cotizador de estadías para el Hotel Nissi, situado a orillas de la Troncal del Caribe en Mingueo, La Guajira.',
      Etiquetapuntos: 'Puntos clave de Hotel Nissi',
      Puntos: [
        { Num: '1.1', Texto: 'Cotizador dinámico de noches y solicitud de reservas con atención vía WhatsApp.' },
        { Num: '1.2', Texto: 'Panel de recepción con PIN para check-in presencial y sincronización en Google Sheets.' },
        { Num: '1.3', Texto: 'Desplegado en Firebase Hosting con datos estructurados Schema.org para SEO.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Sitio web & Cotizador · La Guajira' },
        { Clave: 'Stack', Valor: 'HTML5 · CSS3 · JavaScript · Firebase' },
        { Clave: 'Sitio', Valor: 'hotel-nissi-mingueo.web.app' }
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
      Anterior: { Proyecto: 'Moderador', Nombre: 'Sónica Moderador' },
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
      Dato: 'Proyecto 02 / 05 · App móvil · FinTech & Vivienda',
      Subtitulo: 'Aplicación financiera e inmobiliaria para calcular capacidad de crédito hipotecario (VIS, VIP, No VIS y Leasing), simular subsidios y organizar el ahorro para comprar vivienda en Colombia.',
      Etiquetapuntos: 'Puntos clave de MiTecho',
      Puntos: [
        { Num: '2.1', Texto: 'Backend estructurado con PostgreSQL, Supabase (Auth JWT y API REST) y Supabase Storage para perfiles financieros, transacciones y certificados.' },
        { Num: '2.2', Texto: 'Simulador hipotecario en Pesos y UVR con cruce de subsidios de Cajas de Compensación, Mi Casa Ya y plan interactivo de liberación de cupo.' },
        { Num: '2.3', Texto: 'Emisión de Certificado de Capacidad Financiera en PDF y catálogo de proyectos inmobiliarios aliados por ciudad.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'App móvil · FinTech & PropTech' },
        { Clave: 'Stack', Valor: 'JavaScript · PostgreSQL · Supabase · Storage' },
        { Clave: 'Alcance', Valor: 'Simulación hipotecaria · Subsidios · PDF' }
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
      Dato: 'Proyecto 03 / 05 · Videojuego móvil · Google Play',
      Subtitulo: 'Videojuego de estilo casual y estética neón, disponible en la tienda Google Play.',
      Etiquetapuntos: 'Puntos clave de Neon Jump',
      Puntos: [
        { Num: '3.1', Texto: 'Físicas de salto y generación procedural de niveles.' },
        { Num: '3.2', Texto: 'Integración con servicios de monetización.' },
        { Num: '3.3', Texto: 'Optimización de rendimiento para dispositivos de gama baja.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Videojuego móvil · Google Play' },
        { Clave: 'Stack', Valor: 'Mobile · Google Play · GameDev' },
        { Clave: 'Tienda', Valor: 'Google Play' }
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
      Dato: 'Proyecto 04 / 05 · App móvil · Podcasts con IA',
      Subtitulo: 'Aplicación para escuchar y crear podcasts que genera diálogos realistas, efectos de sonido e imitación de emociones en las voces.',
      Etiquetapuntos: 'Puntos clave de Sónica',
      Puntos: [
        { Num: '4.1', Texto: 'Generación de diálogos realistas.' },
        { Num: '4.2', Texto: 'Uso de WebAudio API para control de sonido inmersivo.' },
        { Num: '4.3', Texto: 'Sistema de usuarios y gestión de contenido interactivo.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'App móvil · Podcasts con IA' },
        { Clave: 'Stack', Valor: 'JavaScript · Audio · WebAudio' },
        { Clave: 'Sitio', Valor: 'sónica.com' }
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
      Dato: 'Proyecto 05 / 05 · Panel web · Back office',
      Subtitulo: 'Panel de control Backoffice utilizado para la moderación del ecosistema Sónica.',
      Etiquetapuntos: 'Puntos clave de Sónica Moderador',
      Puntos: [
        { Num: '5.1', Texto: 'Desarrollado con JavaScript y conexión directa a Firebase.' },
        { Num: '5.2', Texto: 'Gestión en tiempo real de reportes y aprobaciones.' },
        { Num: '5.3', Texto: 'Dashboard analítico para administradores.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Panel web · Back office' },
        { Clave: 'Stack', Valor: 'JavaScript · Firebase · Backoffice' }
      ],
      Accion: { Url: 'https://sonica-moderador-client.web.app/#/login', Texto: 'Ir a Sónica Moderador' },
      Dispositivo: 'portal',
      Capturas: [
        { Src: 'imagenes/moderador-1.webp', Alt: 'Panel principal de Sónica Moderador con métricas de moderación' },
        { Src: 'imagenes/moderador-2.webp', Alt: 'Sección Series publicadas del panel Sónica Moderador' }
      ],
      Anterior: { Proyecto: 'Sonica', Nombre: 'Sónica App de Podcasts' },
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
