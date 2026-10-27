/* Motor reactivo nativo para enlace de plantillas y eventos del DOM */
(function () {
  'use strict';

  function Leer(Objeto, Ruta) {
    var Partes = Ruta.split('.');
    var Valor = Objeto;
    var Indice;

    for (Indice = 0; Indice < Partes.length; Indice += 1) {
      if (Valor === null || Valor === undefined) return undefined;
      Valor = Valor[Partes[Indice]];
    }

    return Valor;
  }

  function Interpolar(Plantilla, Vista) {
    return Plantilla.replace(/\[\[\s*([^\]]+?)\s*\]\]/g, function (Coincidencia, Ruta) {
      var Valor = Leer(Vista, Ruta.trim());
      return Valor === null || Valor === undefined ? '' : String(Valor);
    });
  }

  function Aplicar(Prototipo) {
    Object.assign(Prototipo, {
      Fijarestado: function (Cambio) {
        var Estadoactual = this.Estado || this.state || {};
        var Nuevo = typeof Cambio === 'function' ? Cambio(Estadoactual) : Cambio;
        this.Estado = Object.assign({}, Estadoactual, Nuevo);
        this.state = this.Estado;
        this.Pintar();
      },

      // Alias para mantener compatibilidad
      setState: function (Cambio) {
        this.Fijarestado(Cambio);
      },

      Pintar: function () {
        this.Vista = this.Calcular();
        var Vueltas = 0;
        while (this.Condicionales() && Vueltas < 8) Vueltas += 1;
        this.Enlazar();
        this.Refs();
      },

      // Inserta o retira los bloques <template data-si>
      Condicionales: function () {
        var Yo = this;
        var Cambio = false;
        var Plantillas = this.Raiz.querySelectorAll('template[data-si]');

        Array.prototype.forEach.call(Plantillas, function (Plantilla) {
          var Activo = !!Leer(Yo.Vista, Plantilla.getAttribute('data-si'));
          var Puesto = Yo.Trozos.get(Plantilla);

          if (Activo && !Puesto) {
            var Trozo = Plantilla.content.cloneNode(true);
            var Nodos = Array.prototype.slice.call(Trozo.childNodes);
            Plantilla.parentNode.insertBefore(Trozo, Plantilla.nextSibling);
            Yo.Trozos.set(Plantilla, Nodos);
            Cambio = true;
          } else if (!Activo && Puesto) {
            Puesto.forEach(function (Nodo) {
              if (Nodo.parentNode) Nodo.parentNode.removeChild(Nodo);
            });
            Yo.Trozos.delete(Plantilla);
            Cambio = true;
          }
        });

        return Cambio;
      },

      // Enlaza atributos calculados y contenido de texto
      Enlazar: function () {
        var Vista = this.Vista;
        var Todos = this.Raiz.getElementsByTagName('*');
        var Indice, Atributoindice;

        for (Indice = 0; Indice < Todos.length; Indice += 1) {
          var Nodo = Todos[Indice];
          var Texto = Nodo.getAttribute('data-tx');

          if (Texto !== null) {
            var Valor = Leer(Vista, Texto);
            var Cadena = Valor === null || Valor === undefined ? '' : String(Valor);
            if (Nodo.textContent !== Cadena) Nodo.textContent = Cadena;
          }

          var Nombres = [];
          for (Atributoindice = 0; Atributoindice < Nodo.attributes.length; Atributoindice += 1) {
            if (Nodo.attributes[Atributoindice].name.slice(0, 8) === 'data-at-') {
              Nombres.push(Nodo.attributes[Atributoindice].name);
            }
          }

          for (Atributoindice = 0; Atributoindice < Nombres.length; Atributoindice += 1) {
            var Destino = Nombres[Atributoindice].slice(8);
            var Valortexto = Interpolar(Nodo.getAttribute(Nombres[Atributoindice]), Vista);
            if (Nodo.getAttribute(Destino) !== Valortexto) Nodo.setAttribute(Destino, Valortexto);
          }
        }
      },

      // Avisa cuando un nodo con data-ref entra o sale del documento
      Refs: function () {
        var Yo = this;
        var Vista = this.Vista;
        var Vistos = {};

        Array.prototype.forEach.call(this.Raiz.querySelectorAll('[data-ref]'), function (Nodo) {
          var Ruta = Nodo.getAttribute('data-ref');
          Vistos[Ruta] = true;
          if (Yo.Nodosref[Ruta] !== Nodo) {
            Yo.Nodosref[Ruta] = Nodo;
            var Funcion = Leer(Vista, Ruta);
            if (typeof Funcion === 'function') Funcion(Nodo);
          }
        });

        Object.keys(this.Nodosref).forEach(function (Ruta) {
          if (!Vistos[Ruta] && Yo.Nodosref[Ruta]) {
            Yo.Nodosref[Ruta] = null;
            var Funcion = Leer(Vista, Ruta);
            if (typeof Funcion === 'function') Funcion(null);
          }
        });
      },

      // Delegacion global de eventos desde la raiz
      Escuchar: function () {
        var Yo = this;
        var Tipos = ['click', 'keydown', 'pointermove', 'pointerleave', 'pointerdown', 'pointerup', 'pointercancel', 'focus', 'blur'];

        Tipos.forEach(function (Tipo) {
          var Captura = Tipo === 'focus' || Tipo === 'blur';
          Yo.Raiz.addEventListener(Tipo, function (Evento) {
            var Nodo = Evento.target;
            while (Nodo && Nodo !== Yo.Raiz) {
              var Ruta = Nodo.getAttribute && Nodo.getAttribute('data-ev-' + Tipo);
              if (Ruta) {
                var Funcion = Leer(Yo.Vista, Ruta);
                if (typeof Funcion === 'function') Funcion(Evento);
                return;
              }
              Nodo = Nodo.parentNode;
            }
          }, Captura);
        });
      }
    });
  }

  window.Motorreactivo = {
    Leer: Leer,
    Interpolar: Interpolar,
    Aplicar: Aplicar
  };
})();
