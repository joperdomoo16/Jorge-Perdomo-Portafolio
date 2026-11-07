/* Portafolio de Jorge David Perdomo
   Módulo aislado de validación, saneamiento de entradas, listas blancas e inmutabilidad
*/
(function () {
  'use strict';

  var Propiedadpropia = Object.prototype.hasOwnProperty;

  var Atributosblancos = Object.freeze({
    'class': true,
    'style': true,
    'src': true,
    'href': true,
    'alt': true,
    'id': true,
    'aria-current': true,
    'aria-expanded': true,
    'aria-hidden': true,
    'aria-label': true,
    'aria-labelledby': true
  });

  var Fasescontacto = Object.freeze({
    '': true,
    'Abre': true,
    'Abierto': true,
    'Cierra': true
  });

  var Clasespalabra = Object.freeze({
    'Palabragigante': true,
    'Palabragigante Rojo': true,
    'Palabragigante Tinta': true
  });

  // Verifica que la clave pertenezca directamente al objeto y nunca a la cadena de prototipos
  function Espropio(Objeto, Clave) {
    if (Objeto === null || Objeto === undefined) return false;
    if (typeof Objeto !== 'object' && typeof Objeto !== 'function') return false;
    if (Clave === '__proto__' || Clave === 'prototype' || Clave === 'constructor') return false;
    return Propiedadpropia.call(Objeto, Clave);
  }

  // Congela recursivamente diccionarios y listas estáticas para impedir mutaciones en ejecución
  function Congelar(Objeto) {
    if (Objeto === null || typeof Objeto !== 'object' || Object.isFrozen(Objeto)) return Objeto;
    Object.freeze(Objeto);
    Object.keys(Objeto).forEach(function (Clave) {
      if (Espropio(Objeto, Clave)) Congelar(Objeto[Clave]);
    });
    return Objeto;
  }

  function Atributopermitido(Nombre) {
    return typeof Nombre === 'string' && Espropio(Atributosblancos, Nombre);
  }

  // Acepta únicamente rutas relativas locales hacia la carpeta de imágenes sin saltos de directorio
  function Validarimagen(Ruta) {
    if (typeof Ruta !== 'string') return '';
    var Limpio = Ruta.replace(/[\u0000-\u001F\u007F]+/g, '').trim();
    return /^imagenes\/[a-zA-Z0-9._-]+$/.test(Limpio) ? Limpio : '';
  }

  // Lista blanca estricta de esquemas y rutas para enlaces y recursos dinámicos
  function Validarenlace(Valor, Destino) {
    if (typeof Valor !== 'string') return Destino === 'src' ? '' : '#';
    var Limpio = Valor.replace(/[\u0000-\u001F\u007F]+/g, '').trim();
    if (!Limpio) return Destino === 'src' ? '' : '#';

    if (Destino === 'src') {
      return /^imagenes\/[a-zA-Z0-9._-]+$/.test(Limpio) ? Limpio : '';
    }

    if (/^#[a-zA-Z0-9_-]+$/.test(Limpio)) return Limpio;
    if (/^imagenes\/[a-zA-Z0-9._-]+$/.test(Limpio)) return Limpio;
    if (/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Limpio)) return Limpio;

    if (Limpio.slice(0, 8).toLowerCase() === 'https://' && !/\s/.test(Limpio)) {
      try {
        var Analizada = new URL(Limpio);
        if (Analizada.protocol === 'https:' && !Analizada.username && !Analizada.password && Analizada.hostname) {
          return Limpio;
        }
      } catch (Error) {
        return '#';
      }
    }

    return '#';
  }

  function Validartamano(Valor) {
    if (typeof Valor !== 'string') return '';
    var Limpio = Valor.trim();
    return /^min\(\d+(\.\d+)?vw,\s*\d+(\.\d+)?px\)$/.test(Limpio) ? '--Tamano: ' + Limpio : '';
  }

  // Restringe los estilos en línea dinámicos a las cuatro expresiones legítimas de la interfaz
  function Validarestilo(Valor) {
    if (typeof Valor !== 'string') return '';
    var Limpio = Valor.replace(/[\u0000-\u001F\u007F]+/g, '').trim();
    if (!Limpio) return '';
    if (/^--Tamano:\s*min\(\d+(\.\d+)?vw,\s*\d+(\.\d+)?px\)$/.test(Limpio)) return Limpio;
    if (/^transform:\s*translateX\(-?\d+%\)$/.test(Limpio)) return Limpio;
    if (/^background-image:\s*url\(imagenes\/[a-zA-Z0-9._-]+\)$/.test(Limpio)) return Limpio;
    if (/^--Origenx:\s*-?\d+(\.\d+)?px;\s*--Origeny:\s*-?\d+(\.\d+)?px$/.test(Limpio)) return Limpio;
    return '';
  }

  function Validaridentificador(Valor) {
    if (typeof Valor !== 'string') return '';
    var Limpio = Valor.trim();
    return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(Limpio) ? Limpio : '';
  }

  function Validarclases(Valor) {
    if (typeof Valor !== 'string') return '';
    var Limpio = Valor.replace(/\s+/g, ' ').trim();
    return /^[a-zA-Z0-9 _-]*$/.test(Limpio) ? Limpio : '';
  }

  function Validarfasecontacto(Valor) {
    return typeof Valor === 'string' && Espropio(Fasescontacto, Valor) ? Valor : '';
  }

  function Validarclasepalabra(Valor) {
    return typeof Valor === 'string' && Espropio(Clasespalabra, Valor) ? Valor : 'Palabragigante';
  }

  function Enteromodulo(Valor, Total) {
    if (!Number.isFinite(Total) || Total <= 0) return 0;
    var Entero = Number.isFinite(Valor) ? Math.trunc(Valor) : 0;
    return ((Entero % Total) + Total) % Total;
  }

  function Numeroacotado(Valor, Minimo, Maximo, Defecto) {
    if (!Number.isFinite(Valor)) return Defecto;
    return Math.max(Minimo, Math.min(Maximo, Valor));
  }

  // Normaliza el estado reactivo garantizando tipos, fronteras numéricas y claves conocidas
  function Sanearestado(Estado, Titulos, Totalproyectos) {
    var Base = Estado && typeof Estado === 'object' ? Estado : {};
    var Total = Number.isFinite(Totalproyectos) && Totalproyectos > 0 ? Math.trunc(Totalproyectos) : 1;
    var Palabra = null;
    var Vuelo = null;

    if (Base.Palabra && typeof Base.Palabra === 'object') {
      var Tamano = typeof Base.Palabra.Tamano === 'string' ? Base.Palabra.Tamano.trim() : '';
      Palabra = {
        Texto: typeof Base.Palabra.Texto === 'string' ? Base.Palabra.Texto.slice(0, 80) : '',
        Clase: Validarclasepalabra(Base.Palabra.Clase),
        Tamano: /^min\(\d+(\.\d+)?vw,\s*\d+(\.\d+)?px\)$/.test(Tamano) ? Tamano : ''
      };
    }

    if (Base.Vuelo && typeof Base.Vuelo === 'object') {
      Vuelo = {
        Imagen: Validarimagen(Base.Vuelo.Imagen),
        Moderador: Boolean(Base.Vuelo.Moderador),
        Regreso: Boolean(Base.Vuelo.Regreso),
        Despedida: Boolean(Base.Vuelo.Despedida),
        Indice: Enteromodulo(Base.Vuelo.Indice, Total)
      };
    }

    return {
      Pantalla: Titulos && Espropio(Titulos, Base.Pantalla) ? Base.Pantalla : 'Inicio',
      Saliendo: Boolean(Base.Saliendo),
      Llegando: Boolean(Base.Llegando),
      Llegada: Boolean(Base.Llegada),
      Regreso: Boolean(Base.Regreso),
      Palabra: Palabra,
      Vuelo: Vuelo,
      Contacto: Validarfasecontacto(Base.Contacto),
      Textosllamada: Boolean(Base.Textosllamada),
      Origenx: Numeroacotado(Base.Origenx, -10000, 10000, 0),
      Origeny: Numeroacotado(Base.Origeny, -10000, 10000, 0),
      Menuabierto: Boolean(Base.Menuabierto),
      Copiado: Boolean(Base.Copiado),
      Foco: Math.trunc(Numeroacotado(Base.Foco, -1, 20, -1)),
      Pila: Math.trunc(Numeroacotado(Base.Pila, -100000, 100000, 0)),
      Proyecto: Enteromodulo(Base.Proyecto, Total),
      Portatilabierto: Boolean(Base.Portatilabierto)
    };
  }

  window.Validaciones = Congelar({
    Espropio: Espropio,
    Congelar: Congelar,
    Atributopermitido: Atributopermitido,
    Validarimagen: Validarimagen,
    Validarenlace: Validarenlace,
    Validartamano: Validartamano,
    Validarestilo: Validarestilo,
    Validaridentificador: Validaridentificador,
    Validarclases: Validarclases,
    Validarfasecontacto: Validarfasecontacto,
    Validarclasepalabra: Validarclasepalabra,
    Enteromodulo: Enteromodulo,
    Numeroacotado: Numeroacotado,
    Sanearestado: Sanearestado
  });
})();

