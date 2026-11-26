(function () {
  'use strict';

  var Titulos = {
    Inicio: { Texto: 'DEVELOPER', Clase: 'Palabragigante Rojo', Tamano: '' },
    Habilidades: { Texto: 'habilidades', Clase: 'Palabragigante Tinta', Tamano: 'min(12.4vw, 190px)' },
    Experiencia: { Texto: 'experiencia', Clase: 'Palabragigante Tinta', Tamano: 'min(12.4vw, 190px)' },
    Conoceme: { Texto: 'conóceme', Clase: 'Palabragigante Tinta', Tamano: 'min(14.4vw, 220px)' },
    Nissi: { Texto: 'Nissi', Clase: 'Palabragigante Tinta', Tamano: 'min(21.2vw, 240px)' },
    Mitecho: { Texto: 'MiTecho', Clase: 'Palabragigante Tinta', Tamano: 'min(17.5vw, 228px)' },
    Sonica: { Texto: 'Sónica', Clase: 'Palabragigante Tinta', Tamano: 'min(21.2vw, 240px)' },
    Neon: { Texto: 'Neon Jump', Clase: 'Palabragigante Tinta', Tamano: 'min(14.1vw, 216px)' },
    Moderador: { Texto: 'Moderador', Clase: 'Palabragigante Tinta', Tamano: 'min(12.8vw, 195px)' },
    Khronos: { Texto: 'Khronos', Clase: 'Palabragigante Tinta', Tamano: 'min(16.4vw, 226px)' }
  };

  var Tarjetas = [
    { Proyecto: 'Nissi', Titulo: 'Hospedaje Nissi', Tipo: 'Sitio web y Cotizador', Imagen: 'assets/icono-nissi.webp' },
    { Proyecto: 'Mitecho', Titulo: 'MiTecho', Tipo: 'App Financiera de Vivienda', Imagen: 'assets/icono-mitecho.webp' },
    { Proyecto: 'Neon', Titulo: 'Neon Jump', Tipo: 'Videojuego Móvil', Imagen: 'assets/icono-neon.webp' },
    { Proyecto: 'Sonica', Titulo: 'Sónica', Tipo: 'Podcasts con Inteligencia Artificial', Imagen: 'assets/icono-sonica.webp' },
    { Proyecto: 'Moderador', Titulo: 'Moderador', Tipo: 'Panel de Control y Gestión', Imagen: '' },
    { Proyecto: 'Khronos', Titulo: 'Khronos', Tipo: 'Planificador de Tareas, próximo a producción', Imagen: 'assets/Iconokhronos.webp' }
  ];

  var Capturas = { Nissi: 8, Mitecho: 6, Sonica: 3, Neon: 6, Moderador: 2, Khronos: 1 };

  var Pies = {
    Nissi: [
      'Portada con cotizador de noches',
      'Catálogo y detalle de habitaciones',
      'Ubicación sobre la Troncal del Caribe',
      'Infraestructura y servicios de descanso',
      'Atención y solicitud de reservas por WhatsApp',
      'Control de acceso con PIN a recepción',
      'Rack operativo de habitaciones en tiempo real',
      'Panel gerencial con métricas'
    ],
    Mitecho: [
      'Panel principal con cupo de vivienda, subsidio y meta de cuota inicial',
      'Simulador de crédito con deudas y modalidades VIS, VIP y No VIS',
      'Cierre financiero, comparación entre pesos y UVR y resumen en PDF',
      'Registro de ingresos y gastos por día y por mes',
      'Plan para subir el cupo pagando deudas',
      'Proyectos de vivienda según presupuesto y ciudad'
    ],
    Sonica: ['Inicio con serie destacada', 'Reproductor con forma de onda', 'Explorar por categorías'],
    Neon: [
      'Menú principal con reto del día, racha diaria y accesos rápidos',
      'Partida en curso, con el cielo que cambia según la altura',
      'Ranking global y semanal con podio de jugadores',
      'Tienda de 22 skins organizadas en 4 categorías con vista previa',
      'Sistema de 27 logros por familias con progreso y recompensas',
      'Perfil con estadísticas, cuenta de Google y ajustes de control'
    ],
    Moderador: ['Panel principal con métricas', 'Series publicadas'],
    Khronos: ['Pantalla de inicio con video en bucle y acceso']
  };

  var Detalles = {
    Nissi: {
      Id: 'Nissi',
      Titulo: 'Nissi',
      Antetitulo: 'Hospedaje',
      Tamano: 'min(21.2vw, 240px)',
      Idtitulo: 'Titulonissi',
      Esimagen: true,
      Imagen: 'assets/icono-nissi.webp',
      Alticono: 'Ícono de Hospedaje Nissi',
      Dato: 'Web y Gestión Hotelera · La Guajira',
      Subtitulo: 'Sitio web oficial y sistema de reservas del Hospedaje Nissi en Mingueo, La Guajira',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Hospedaje Nissi',
      Puntos: [
        { Num: '·', Texto: 'Hice la interfaz en JavaScript y CSS, adaptable a celular y computador, con datos estructurados de Schema para que Google entienda la información del hospedaje.' },
        { Num: '·', Texto: 'Las solicitudes de reserva llegan por WhatsApp y un asistente con Gemini responde las preguntas frecuentes de los viajeros.' },
        { Num: '·', Texto: 'La recepción funciona con Google Apps Script y Google Sheets: el recepcionista entra con un PIN, marca las habitaciones ocupadas y el administrador recibe un resumen diario por correo.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Web y Gestión hotelera' },
        { Clave: 'Stack', Valor: 'JavaScript · Apps Script · Google Sheets · Gemini AI · WhatsApp API' },
        { Clave: 'Alcance', Valor: 'Cotizador en vivo y panel de recepción' }
      ],
      Accion: { Url: 'https://hospedaje-nissi-mingueo.web.app/index.html', Texto: 'Ir a Hospedaje Nissi' },
      Dispositivo: 'portal',
      Capturas: [
        { Src: 'assets/nissi-1.webp', Alt: 'Portada principal de Hospedaje Nissi con cotizador de noches' },
        { Src: 'assets/nissi-2.webp', Alt: 'Catálogo y detalle de habitaciones' },
        { Src: 'assets/nissi-3.webp', Alt: 'Ubicación sobre la Troncal del Caribe' },
        { Src: 'assets/nissi-4.webp', Alt: 'Infraestructura y servicios de descanso' },
        { Src: 'assets/nissi-5.webp', Alt: 'Atención y solicitud de reservas por WhatsApp' },
        { Src: 'assets/nissi-6.webp', Alt: 'Control de acceso con PIN a recepción' },
        { Src: 'assets/nissi-7.webp', Alt: 'Rack operativo de habitaciones en tiempo real' },
        { Src: 'assets/nissi-8.webp', Alt: 'Panel gerencial con métricas' }
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
      Imagen: 'assets/icono-mitecho.webp',
      Alticono: 'Ícono de la aplicación MiTecho',
      Dato: 'Aplicación Móvil · Finanzas y Vivienda',
      Subtitulo: 'Aplicación móvil que ayuda a las familias en Colombia a planear la compra de su casa',
      Etiquetapuntos: 'Cómo funciona y tecnologías de MiTecho',
      Puntos: [
        { Num: '·', Texto: 'La app está hecha en JavaScript y se empaqueta para celular con Capacitor. En la parte nativa, escrita en Java, cifro los datos guardados en el teléfono y bloqueo las capturas de pantalla.' },
        { Num: '·', Texto: 'Los datos están en Supabase con PostgreSQL, y una función programada consulta cada día las tasas de interés que publica la Superfinanciera.' },
        { Num: '·', Texto: 'El simulador compara el crédito en pesos y en UVR, suma el subsidio de la caja de compensación y de Mi Casa Ya, y genera un resumen en PDF de tres páginas.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Aplicación móvil para Android e iOS' },
        { Clave: 'Stack', Valor: 'JavaScript · Capacitor · Java · Supabase · PostgreSQL · Deno' },
        { Clave: 'Alcance', Valor: 'Simulador de crédito · Subsidios · Certificado en PDF' }
      ],
      Accion: null,
      Dispositivo: 'movil',
      Capturas: [
        { Src: 'assets/mitecho-1.webp', Alt: 'Panel principal de MiTecho con cupo de vivienda, subsidio de Caja y progreso de cuota inicial' },
        { Src: 'assets/mitecho-2.webp', Alt: 'Simulador de crédito de MiTecho con ingresos, deudas y modalidades de vivienda' },
        { Src: 'assets/mitecho-3.webp', Alt: 'Resultado de cierre financiero de MiTecho con comparación entre pesos y UVR y descarga del resumen en PDF' },
        { Src: 'assets/mitecho-4.webp', Alt: 'Registro mensual de ingresos y gastos en MiTecho' },
        { Src: 'assets/mitecho-5.webp', Alt: 'Plan para subir el cupo de crédito pagando deudas en MiTecho' },
        { Src: 'assets/mitecho-6.webp', Alt: 'Proyectos de vivienda por municipio en MiTecho' }
      ],
      Anterior: { Proyecto: 'Nissi', Nombre: 'Hospedaje Nissi' },
      Siguiente: { Proyecto: 'Neon', Nombre: 'Neon Jump' }
    },
    Neon: {
      Id: 'Neon',
      Titulo: 'Neon Jump',
      Tamano: 'min(14.1vw, 216px)',
      Idtitulo: 'Tituloneon',
      Esimagen: true,
      Imagen: 'assets/icono-neon.webp',
      Alticono: 'Ícono del juego Neon Jump',
      Dato: 'Videojuego Móvil · Google Play',
      Subtitulo: 'Videojuego móvil de saltos infinitos con estética Noche Suave, publicado en Google Play',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Neon Jump',
      Puntos: [
        { Num: '·', Texto: 'El juego está hecho en HTML, CSS y JavaScript dentro de un WebView, con Flutter como app nativa. La física, las plataformas móviles, frágiles y de resorte, y el cielo que cambia con la altura son código propio.' },
        { Num: '·', Texto: 'Con Firebase manejo el inicio de sesión con Google, el ranking global y semanal, los retos diarios, la tienda de skins y los logros. App Check con Play Integrity revisa que las peticiones vengan de la app.' },
        { Num: '·', Texto: 'El progreso se guarda cifrado en el dispositivo y se migra desde versiones anteriores. Los anuncios son de AdMob, incluido uno con premio para revivir, y las actualizaciones se avisan con Play Core.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Videojuego móvil en dos dimensiones' },
        { Clave: 'Stack', Valor: 'HTML · CSS · JavaScript · Flutter · Dart · Firebase · AdMob' },
        { Clave: 'Tienda', Valor: 'Google Play Store' }
      ],
      Accion: { Url: 'https://play.google.com/store/apps/details?id=com.tustudio.neon%5Fjump', Texto: 'Ver en Google Play' },
      Dispositivo: 'movil',
      Capturas: [
        { Src: 'assets/neon-1.webp', Alt: 'Menú principal de Neon Jump Noche Suave con reto del día y racha diaria' },
        { Src: 'assets/neon-2.webp', Alt: 'Partida en curso de Neon Jump sobre la ciudad nocturna' },
        { Src: 'assets/neon-3.webp', Alt: 'Ranking global y semanal de Neon Jump con podio de jugadores' },
        { Src: 'assets/neon-4.webp', Alt: 'Tienda de 22 skins de Neon Jump organizadas por categorías' },
        { Src: 'assets/neon-5.webp', Alt: 'Pantalla de logros de Neon Jump con progreso y recompensas en monedas' },
        { Src: 'assets/neon-6.webp', Alt: 'Perfil de Neon Jump con estadísticas, vinculación con Google y ajustes' }
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
      Imagen: 'assets/icono-sonica.webp',
      Alticono: 'Ícono de la aplicación Sónica',
      Dato: 'Web y Aplicación Móvil · Podcasts con IA',
      Subtitulo: 'Plataforma web y móvil para crear y escuchar podcasts con voces de inteligencia artificial',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Sónica',
      Puntos: [
        { Num: '·', Texto: 'La app está hecha en JavaScript con Tailwind CSS, sin framework de interfaz, y se empaqueta para celular con Capacitor.' },
        { Num: '·', Texto: 'Hice un reproductor que sigue sonando mientras se navega el catálogo y una pantalla completa que dibuja la forma de onda del episodio.' },
        { Num: '·', Texto: 'Firebase maneja los usuarios y el audio; las voces de los personajes se generan con ElevenLabs, y los creadores tienen un panel para subir capítulos y ver sus estadísticas.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Plataforma web y aplicación móvil' },
        { Clave: 'Stack', Valor: 'JavaScript · Java · Capacitor · Tailwind CSS · Firebase · ElevenLabs' },
        { Clave: 'Alcance', Valor: 'Podcasts con voces sintéticas y reproductor continuo' }
      ],
      Accion: { Url: 'https://sónica.com', Texto: 'Ir a Sónica' },
      Dispositivo: 'movil',
      Capturas: [
        { Src: 'assets/sonica-1.webp', Alt: 'Pantalla de inicio de Sónica con la serie destacada y episodios para seguir escuchando' },
        { Src: 'assets/sonica-2.webp', Alt: 'Reproductor de Sónica con la forma de onda del episodio y los controles' },
        { Src: 'assets/sonica-3.webp', Alt: 'Categorías populares en la sección Explorar de Sónica' }
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
      Subtitulo: 'Panel en tiempo real para revisar, aprobar o rechazar el contenido publicado en Sónica',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Sónica Moderador',
      Puntos: [
        { Num: '·', Texto: 'El panel está hecho en JavaScript con Tailwind CSS y Vite, sin framework de interfaz.' },
        { Num: '·', Texto: 'Se conecta a Cloud Firestore con escuchas en tiempo real, así las series, los capítulos y los reportes aparecen sin recargar la página.' },
        { Num: '·', Texto: 'Firebase Auth limita el acceso a moderadores y administradores, y cada aprobación o rechazo queda registrado en una bitácora.' }
      ],
      Ficha: [
        { Clave: 'Tipo', Valor: 'Panel de administración y control en vivo' },
        { Clave: 'Stack', Valor: 'JavaScript · Tailwind CSS · Vite · Firebase · Cloud Firestore' },
        { Clave: 'Alcance', Valor: 'Moderación en vivo y bitácora de auditoría' }
      ],
      Accion: { Url: 'https://sonica-moderador-client.web.app/#/login', Texto: 'Ir a Sónica Moderador' },
      Dispositivo: 'portal',
      Capturas: [
        { Src: 'assets/moderador-1.webp', Alt: 'Panel principal de Sónica Moderador con métricas de moderación' },
        { Src: 'assets/moderador-2.webp', Alt: 'Sección Series publicadas del panel Sónica Moderador' }
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
      Imagen: 'assets/Iconokhronos.webp',
      Alticono: 'Isotipo de Khronos, una K que también es un reloj de arena',
      Dato: 'Aplicación Web · Planificador de Tareas',
      Subtitulo: 'Planificador de tareas para equipos de trabajo',
      Etiquetapuntos: 'Cómo funciona y tecnologías de Khronos',
      Puntos: [
        { Num: '·', Texto: 'La pantalla de inicio tiene un video en bucle de una pared con un reloj de arena; al iniciar sesión, otro video hace la transición al panel. El logo es una K que también es un reloj de arena.' },
        { Num: '·', Texto: 'El tablero está hecho con HTML, Bootstrap y JavaScript: las tarjetas se arrastran entre Por hacer, En proceso, Revisión y Hecho, el formulario valida los campos y todo se guarda en localStorage.' },
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
        { Src: 'assets/Khronosinicio.webp', Alt: 'Pantalla de inicio de Khronos con el lema Domina tu tiempo, conquista tus proyectos, una figura frente a un reloj de arena iluminado y el formulario de acceso' }
      ],
      Anterior: { Proyecto: 'Moderador', Nombre: 'Sónica Moderador' },
      Siguiente: { Proyecto: 'Nissi', Nombre: 'Hospedaje Nissi' }
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
