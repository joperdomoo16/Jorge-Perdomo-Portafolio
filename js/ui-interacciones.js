(function () {
  'use strict';

  var Validaciones = window.Validaciones;

  function Curva(Puntos, Muestras) {
    var Salida = [];
    var Total = Puntos.length - 1;
    var Tramo, Paso, T, Tcuadrado, Tcubo, Acumulado, Indice;

    for (Tramo = 0; Tramo < Total; Tramo += 1) {
      var Puntocero = Puntos[Math.max(0, Tramo - 1)];
      var Puntouno = Puntos[Tramo];
      var Puntodos = Puntos[Tramo + 1];
      var Puntotres = Puntos[Math.min(Total, Tramo + 2)];

      for (Paso = 0; Paso < Muestras; Paso += 1) {
        T = Paso / Muestras;
        Tcuadrado = T * T;
        Tcubo = Tcuadrado * T;

        Salida.push({
          x: 0.5 * ((2 * Puntouno.x) + (-Puntocero.x + Puntodos.x) * T + (2 * Puntocero.x - 5 * Puntouno.x + 4 * Puntodos.x - Puntotres.x) * Tcuadrado + (-Puntocero.x + 3 * Puntouno.x - 3 * Puntodos.x + Puntotres.x) * Tcubo),
          y: 0.5 * ((2 * Puntouno.y) + (-Puntocero.y + Puntodos.y) * T + (2 * Puntocero.y - 5 * Puntouno.y + 4 * Puntodos.y - Puntotres.y) * Tcuadrado + (-Puntocero.y + 3 * Puntouno.y - 3 * Puntodos.y + Puntotres.y) * Tcubo)
        });
      }
    }

    Salida.push({ x: Puntos[Total].x, y: Puntos[Total].y });
    Acumulado = 0;
    Salida[0].s = 0;

    for (Indice = 1; Indice < Salida.length; Indice += 1) {
      Acumulado += Math.hypot(Salida[Indice].x - Salida[Indice - 1].x, Salida[Indice].y - Salida[Indice - 1].y);
      Salida[Indice].s = Acumulado;
    }

    return Salida;
  }

  function Bezier(Puntoa, Puntob, Puntoc, Puntod, Muestras) {
    var Salida = [];
    var Acumulado = 0;
    var Indice, T, U, Punto;

    for (Indice = 0; Indice <= Muestras; Indice += 1) {
      T = Indice / Muestras;
      U = 1 - T;
      Punto = {
        x: U * U * U * Puntoa.x + 3 * U * U * T * Puntob.x + 3 * U * T * T * Puntoc.x + T * T * T * Puntod.x,
        y: U * U * U * Puntoa.y + 3 * U * U * T * Puntob.y + 3 * U * T * T * Puntoc.y + T * T * T * Puntod.y
      };

      if (Indice > 0) Acumulado += Math.hypot(Punto.x - Salida[Indice - 1].x, Punto.y - Salida[Indice - 1].y);
      Punto.s = Acumulado;
      Salida.push(Punto);
    }

    return Salida;
  }

  function Espiral(Guia, Vueltas, Radio, Corrimiento) {
    var Largo = Guia[Guia.length - 1].s || 1;
    var Muestras = Math.max(60, Math.round(Vueltas * 11));
    var Tramo = 1;
    var Texto = '';
    var Indice, S, Puntoa, Puntob, Fraccion, X, Y, Dx, Dy, Norma, Tx, Ty, Nx, Ny, T, Envolvente, Fase, R, Px, Py;

    for (Indice = 0; Indice <= Muestras; Indice += 1) {
      S = (Indice / Muestras) * Largo;
      while (Tramo < Guia.length - 1 && Guia[Tramo].s < S) Tramo += 1;

      Puntoa = Guia[Tramo - 1];
      Puntob = Guia[Tramo];
      Fraccion = (S - Puntoa.s) / Math.max(1e-6, Puntob.s - Puntoa.s);

      X = Puntoa.x + (Puntob.x - Puntoa.x) * Fraccion;
      Y = Puntoa.y + (Puntob.y - Puntoa.y) * Fraccion;
      Dx = Puntob.x - Puntoa.x;
      Dy = Puntob.y - Puntoa.y;
      Norma = Math.hypot(Dx, Dy) || 1;

      Tx = Dx / Norma;
      Ty = Dy / Norma;
      Nx = -Ty;
      Ny = Tx;

      T = Indice / Muestras;
      Envolvente = Math.min(1, T / 0.035, (1 - T) / 0.035);
      Fase = Math.PI * 2 * Vueltas * T;
      R = Radio * Envolvente;

      Px = X + Nx * R * Math.sin(Fase) + Tx * R * 0.6 * Math.cos(Fase) + (Corrimiento || 0);
      Py = Y + Ny * R * Math.sin(Fase) + Ty * R * 0.6 * Math.cos(Fase) + (Corrimiento || 0);

      Texto += (Indice === 0 ? 'M' : 'L') + Px.toFixed(1) + ',' + Py.toFixed(1);
    }

    return Texto;
  }

  var Geometria = Validaciones.Congelar({
    Curva: Curva,
    Bezier: Bezier,
    Espiral: Espiral
  });

  function Movimientoreducido() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (Error) {
      return false;
    }
  }

  function Copiartexto(Texto, Campo, Alcopiar) {
    var Exito = function () {
      if (typeof Alcopiar === 'function') Alcopiar(true);
    };

    var Respaldo = function () {
      try {
        if (!Campo) return;
        Campo.focus({ preventScroll: true });
        Campo.select();
        if (document.execCommand('copy')) Exito();
      } catch (Error) {}
    };

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(Texto).then(Exito, Respaldo);
      } else {
        Respaldo();
      }
    } catch (Error) {
      Respaldo();
    }
  }

  var Utilidades = Validaciones.Congelar({
    Movimientoreducido: Movimientoreducido,
    Copiartexto: Copiartexto
  });

  function Leer(Objeto, Ruta) {
    if (typeof Ruta !== 'string' || !Ruta) return undefined;
    var Partes = Ruta.split('.');
    var Valor = Objeto;
    var Indice;

    for (Indice = 0; Indice < Partes.length; Indice += 1) {
      var Clave = Partes[Indice];
      if (!Validaciones.Espropio(Valor, Clave)) return undefined;
      Valor = Valor[Clave];
    }

    return Valor;
  }

  function Interpolar(Plantilla, Vista) {
    if (typeof Plantilla !== 'string') return '';
    return Plantilla.replace(/\[\[\s*([^\]]+?)\s*\]\]/g, function (Coincidencia, Ruta) {
      var Valor = Leer(Vista, Ruta.trim());
      return Valor === null || Valor === undefined ? '' : String(Valor);
    });
  }

  function Aplicar(Prototipo) {
    Object.assign(Prototipo, {
      Fijarestado: function (Cambio) {
        var Estadoactual = this.Estado || {};
        var Nuevo = typeof Cambio === 'function' ? Cambio(Estadoactual) : Cambio;
        if (!Nuevo || typeof Nuevo !== 'object') return;
        var Combinado = Object.assign({}, Estadoactual, Nuevo);
        var Total = this.Tarjetas ? this.Tarjetas.length : 1;
        this.Estado = Validaciones.Sanearestado(Combinado, this.Titulos, Total);
        this.Pintar();
      },

      Pintar: function () {
        this.Vista = this.Calcular();
        var Vueltas = 0;
        while (this.Condicionales() && Vueltas < 8) Vueltas += 1;
        this.Enlazar();
        this.Refs();
      },

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
            var Destino = Nombres[Atributoindice].slice(8).toLowerCase();
            if (!Validaciones.Atributopermitido(Destino)) continue;

            var Valortexto = Interpolar(Nodo.getAttribute(Nombres[Atributoindice]), Vista);

            if (Destino === 'href' || Destino === 'src') {
              Valortexto = Validaciones.Validarenlace(Valortexto, Destino);
              if (Destino === 'src' && !Valortexto) {
                if (Nodo.hasAttribute('src')) Nodo.removeAttribute('src');
                continue;
              }
            } else if (Destino === 'style') {
              Valortexto = Validaciones.Validarestilo(Valortexto);
              if (!Valortexto) {
                if (Nodo.hasAttribute('style')) Nodo.removeAttribute('style');
                continue;
              }
            } else if (Destino === 'id') {
              Valortexto = Validaciones.Validaridentificador(Valortexto);
              if (!Valortexto) continue;
            } else if (Destino === 'class') {
              Valortexto = Validaciones.Validarclases(Valortexto);
            }

            if (Nodo.getAttribute(Destino) !== Valortexto) Nodo.setAttribute(Destino, Valortexto);
          }
        }
      },

      Refs: function () {
        var Yo = this;
        var Vista = this.Vista;
        var Vistos = Object.create(null);

        Array.prototype.forEach.call(this.Raiz.querySelectorAll('[data-ref]'), function (Nodo) {
          var Ruta = Nodo.getAttribute('data-ref');
          Vistos[Ruta] = true;
          if (!Validaciones.Espropio(Yo.Nodosref, Ruta) || Yo.Nodosref[Ruta] !== Nodo) {
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

  var Motorreactivo = Validaciones.Congelar({
    Leer: Leer,
    Interpolar: Interpolar,
    Aplicar: Aplicar
  });

  var Metodostransiciones = Validaciones.Congelar({
    Ir(Destino, Vuelo) {
      if (!Validaciones.Espropio(this.Titulos, Destino)) return;
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      if (Destino === Estado.Pantalla) { this.Fijarestado({ Menuabierto: false }); return; }
      if (this.Movimientoreducido()) {
        this.Fijarestado({ Pantalla: Destino, Regreso: false, Menuabierto: false, Pila: 0, Portatilabierto: false, Foco: -1 });
        this.Subir();
        return;
      }
      const Titulo = this.Titulos[Destino];
      const Pantallaactual = Validaciones.Espropio(this.Titulos, Estado.Pantalla) ? Estado.Pantalla : 'Inicio';
      const Indiceactual = this.Tarjetas.findIndex((T) => T.Proyecto === Pantallaactual);
      const Indicedestino = this.Tarjetas.findIndex((T) => T.Proyecto === Destino);
      let Vuelofinal = Vuelo || null;
      let Proyectonuevo = Estado.Proyecto || 0;

      if (Indicedestino >= 0) Proyectonuevo = Indicedestino;

      const Medir = (Nodo) => {
        if (!Nodo) return null;
        const Caja = Nodo.getBoundingClientRect();
        const Lado = Nodo.offsetWidth || Caja.width;
        const Centrox = Caja.left + Caja.width / 2 - Lado / 2;
        const Centroy = Caja.top + Caja.height / 2 - Lado / 2;
        const Envista = Caja.bottom > 0 && Caja.top < window.innerHeight;
        return {
          X: Centrox,
          Y: Envista ? Centroy : Math.round(window.innerHeight * 0.22),
          Lado: Lado,
          Angulo: -8
        };
      };

      if (!Vuelofinal && Indicedestino >= 0) {
        const Datosdestino = this.Tarjetas[Indicedestino];
        const Nodoactual = this.Nodoicono(Pantallaactual) || (Indiceactual >= 0 ? this.Nodostarjeta[Indiceactual] : null);
        const Origen = Medir(Nodoactual);
        if (Origen) {
          this.Origenvuelo = Origen;
          Vuelofinal = { Imagen: Datosdestino.Imagen, Moderador: !Datosdestino.Imagen };
        }
      } else if (!Vuelofinal && Indiceactual >= 0) {
        const Datosactual = this.Tarjetas[Indiceactual];
        const Origen = Medir(this.Nodoicono(Pantallaactual));
        if (Origen) {
          this.Origenvuelo = Origen;
          if (Destino === 'Inicio') {
            Proyectonuevo = Indiceactual;
            Vuelofinal = {
              Imagen: Datosactual.Imagen,
              Moderador: !Datosactual.Imagen,
              Regreso: true,
              Indice: Indiceactual
            };
          } else {
            Vuelofinal = {
              Imagen: Datosactual.Imagen,
              Moderador: !Datosactual.Imagen,
              Despedida: true
            };
          }
        }
      }

      this.Destino = Destino;
      this.Palabralista = false;
      this.Palabracrece = false;
      this.Fijarestado({
        Proyecto: Proyectonuevo,
        Saliendo: true,
        Menuabierto: false,
        Palabra: { Texto: Titulo.Texto, Clase: Titulo.Clase, Tamano: Titulo.Tamano },
        Vuelo: Vuelofinal
      });

      this.Esperar(440, () => {
        const Esregreso = !!(this.Estado && this.Estado.Vuelo && this.Estado.Vuelo.Regreso);
        this.Fijarestado({ Pantalla: Destino, Saliendo: false, Llegando: true, Llegada: true, Regreso: Esregreso, Pila: 0, Portatilabierto: false, Foco: -1 });
        this.Subir();
        if (this.Estado && this.Estado.Vuelo && this.Estado.Vuelo.Despedida) {
          this.Doblecuadro(() => this.Viajarvuelo());
        }
        this.Esperar(300, () => this.Doblecuadro(() => this.Crecerpalabra()));
      });
    },

    Nodotitulo(Id) {
      if (Validaciones.Espropio(this.Detalles, Id)) return this.Nodotituloproyecto || null;
      return this.Nodostitulo[Id] || null;
    },

    Nodoicono(Id) {
      if (Validaciones.Espropio(this.Detalles, Id)) return this.Nodoiconoproyecto || null;
      return this.Nodosicono[Id] || null;
    },

    Subir() {
      try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (Error) {
        try { window.scrollTo(0, 0); } catch (Erroralterno) {}
      }
    },

    Colocarpalabra() {
      const Nodo = this.Nodopalabra;
      if (!Nodo) return;
      const Interior = Nodo.firstElementChild;
      if (!Interior) return;
      Nodo.style.transform = 'none';
      const Caja = Interior.getBoundingClientRect();
      this.Cajapalabra = { Ancho: Caja.width, Alto: Caja.height, X: Caja.left, Y: Caja.top };
      const Ancho = window.innerWidth;
      const Alto = window.innerHeight;
      const Escala = Math.min(0.5, (Ancho < 700 ? Ancho * 0.36 : 300) / Math.max(1, Caja.width));
      const X = Ancho / 2 - (Caja.width * Escala) / 2 - Caja.left * Escala;
      const Y = Alto / 2 - (Caja.height * Escala) / 2 - Caja.top * Escala;
      Nodo.style.transform = 'translate(' + X.toFixed(1) + 'px, ' + Y.toFixed(1) + 'px) scale(' + Escala.toFixed(4) + ')';
      this.Palabralista = true;
      Nodo.classList.add('Lista');
    },

    Crecerpalabra() {
      const Nodo = this.Nodopalabra;
      const Destino = this.Nodotitulo(this.Destino);
      if (!Nodo || !Destino || !this.Cajapalabra) { this.Terminarcambio(); return; }
      const Caja = Destino.getBoundingClientRect();
      const Escala = Caja.width / Math.max(1, this.Cajapalabra.Ancho);
      const X = Caja.left - this.Cajapalabra.X * Escala;
      const Y = Caja.top - this.Cajapalabra.Y * Escala;
      this.Palabracrece = true;
      Nodo.classList.add('Lista', 'Crece');
      Nodo.style.transform = 'translate(' + X.toFixed(1) + 'px, ' + Y.toFixed(1) + 'px) scale(' + Escala.toFixed(4) + ')';
      if (this.Estado && this.Estado.Vuelo) this.Viajarvuelo();
      this.Esperar(720, () => this.Terminarcambio());
    },

    Terminarcambio() {
      this.Palabralista = false;
      this.Palabracrece = false;
      this.Fijarestado({ Palabra: null, Llegando: false, Vuelo: null });
    },

    Abrirproyecto(Indice) {
      if (!Number.isInteger(Indice) || Indice < 0 || Indice >= this.Tarjetas.length) return;
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      const Datos = this.Tarjetas[Indice];
      const Nodo = this.Nodostarjeta[Indice];
      if (!Nodo || this.Movimientoreducido()) { this.Ir(Datos.Proyecto); return; }
      const Caja = Nodo.getBoundingClientRect();
      const Lado = Nodo.offsetWidth;
      this.Origenvuelo = { X: Caja.left + Caja.width / 2 - Lado / 2, Y: Caja.top + Caja.height / 2 - Lado / 2, Lado: Lado, Angulo: 0 };
      this.Ir(Datos.Proyecto, { Imagen: Datos.Imagen, Moderador: !Datos.Imagen });
    },

    Colocarvuelo() {
      const Nodo = this.Nodovuelo;
      const Origen = this.Origenvuelo;
      if (!Nodo || !Origen) return;
      Nodo.classList.remove('Viaja', 'Despedida');
      Nodo.style.opacity = '1';
      Nodo.style.left = Origen.X + 'px';
      Nodo.style.top = Origen.Y + 'px';
      Nodo.style.width = Origen.Lado + 'px';
      Nodo.style.height = Origen.Lado + 'px';
      Nodo.style.fontSize = (Origen.Lado / 116 * 16) + 'px';
      Nodo.style.transform = 'rotate(' + Origen.Angulo.toFixed(2) + 'deg) scale(1.08)';
    },

    Viajarvuelo() {
      const Nodo = this.Nodovuelo;
      const Vuelo = this.Estado && this.Estado.Vuelo;
      if (!Nodo || !Vuelo) return;

      if (Vuelo.Despedida) {
        if (Nodo.classList.contains('Despedida')) return;
        Nodo.classList.add('Viaja', 'Despedida');
        Nodo.style.transform = 'translateY(-28px) rotate(6deg) scale(0.45)';
        Nodo.style.opacity = '0';
        return;
      }

      if (Vuelo.Regreso) {
        const Destino = this.Nodostarjeta[Vuelo.Indice];
        if (!Destino) return;
        const Caja = Destino.getBoundingClientRect();
        const Lado = Destino.offsetWidth || Caja.width;
        let Desfasey = 0;
        const Vitrina = Destino.closest('.Vitrina');
        const Escenario = Destino.closest('.Escenario');
        if (Vitrina && Escenario) {
          Desfasey = Vitrina.getBoundingClientRect().bottom - (Escenario.getBoundingClientRect().bottom + 4);
        }
        Nodo.classList.add('Viaja');
        Nodo.style.left = (Caja.left + Caja.width / 2 - Lado / 2) + 'px';
        Nodo.style.top = (Caja.top - Desfasey + Caja.height / 2 - Lado / 2) + 'px';
        Nodo.style.width = Lado + 'px';
        Nodo.style.height = Lado + 'px';
        Nodo.style.fontSize = (Lado / 116 * 16) + 'px';
        Nodo.style.transform = 'rotate(0deg) scale(1)';
        return;
      }

      const Destino = this.Nodoicono(this.Destino);
      if (!Destino) return;
      const Caja = Destino.getBoundingClientRect();
      const Lado = Destino.offsetWidth || Caja.width;
      Nodo.classList.add('Viaja');
      Nodo.style.left = (Caja.left + Caja.width / 2 - Lado / 2) + 'px';
      Nodo.style.top = (Caja.top + Caja.height / 2 - Lado / 2) + 'px';
      Nodo.style.width = Lado + 'px';
      Nodo.style.height = Lado + 'px';
      Nodo.style.fontSize = (Lado / 116 * 16) + 'px';
      Nodo.style.transform = 'rotate(-8deg)';
    }
  });

  const Pasogrados = 22.5;
  const Pasoradianes = Pasogrados * Math.PI / 180;
  const Factorradio = 2.3;
  const Rigidez = 210;
  const Amortiguacion = 18.5;
  const Seguimiento = 0.42;
  const Imanradio = 1.5;
  const Modulo = (Numero, Total) => ((Numero % Total) + Total) % Total;
  const Limitar = (Valor, Minimo, Maximo) => Math.max(Minimo, Math.min(Maximo, Valor));

  var Metodosvitrina = Validaciones.Congelar({
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
      this.Nodoescenario = Nodo.closest('.Escenario');
      if (this.Nodoescenario) {
        this.Nodoescenario.addEventListener('pointermove', this.Manejadoresrueda.Seguir);
        this.Nodoescenario.addEventListener('pointerleave', this.Manejadoresrueda.Olvidar);
      }
      Promise.resolve().then(() => { if (this.Nodorueda === Nodo) this.Iniciarrueda(); });
    },

    Montaresfera(Nodo) {
      this.Nodoesfera = Nodo;
      this.Giroesfera = Nodo ? Nodo.querySelector('.Esferagiro') : null;
    },

    Iniciarrueda() {
      const Estado = this.Estado || {};
      const Total = this.Tarjetas.length;
      const Proyecto = Validaciones.Enteromodulo(Estado.Proyecto, Total);
      const Previa = this.Rueda;
      const Objetivo = Previa && Number.isFinite(Previa.Objetivo) && Modulo(Previa.Objetivo, Total) === Proyecto ? Previa.Objetivo : Proyecto;
      this.Rueda = {
        Posicion: Objetivo, Objetivo: Objetivo, Velocidad: 0,
        Arrastre: null, Libre: false, Retenida: false,
        Cursor: null, Desvio: 0, Iman: this.Tarjetas.map(() => 0)
      };

      const Regreso = Estado.Vuelo && Estado.Vuelo.Regreso;
      if (!this.Movimientoreducido() && !Regreso) {
        this.Rueda.Posicion = Objetivo - 1.1;
        this.Rueda.Retenida = true;
        this.Colocarrueda();
        this.Esperar(Estado.Llegada ? 1500 : 920, () => {
          if (!this.Rueda) return;
          this.Rueda.Retenida = false;
          this.Rueda.Velocidad = 1.5;
          this.Animarrueda();
        });
        return;
      }
      this.Colocarrueda();
    },

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
        const Opacidad = Limitar((Math.min(Mitad, 2) - Distancia) / 0.6, 0, 1);

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

      if (this.Giroesfera) {
        this.Giroesfera.setAttribute('transform', 'rotate(' + (-Posicion * Pasogrados).toFixed(3) + ' 200 200)');
      }

      if (Rueda.Arrastre || Rueda.Libre) {
        const Cercano = Validaciones.Enteromodulo(Math.round(Posicion), Total);
        if (Cercano !== ((this.Estado && this.Estado.Proyecto) || 0)) this.Fijarestado({ Proyecto: Cercano });
      }
      return Inquieto;
    },

    Seguircursor(Evento) {
      const Rueda = this.Rueda;
      if (!Rueda || Rueda.Retenida || !this.Nodorueda || Evento.pointerType === 'touch' || this.Movimientoreducido()) return;
      const Caja = this.Nodorueda.getBoundingClientRect();
      const Referencia = this.Nodostarjeta.find((N) => N);
      const Lado = Referencia ? Referencia.offsetWidth : 90;
      const X = Evento.clientX - (Caja.left + Caja.width / 2);
      const Y = Evento.clientY - Caja.top;
      Rueda.Cursor = { X: X, Y: Y };
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
          const Meta = Rueda.Objetivo + Rueda.Desvio;
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
      if (!Number.isFinite(Objetivo)) return;
      const Rueda = this.Rueda;
      const Total = this.Tarjetas.length;
      const Proyecto = Validaciones.Enteromodulo(Objetivo, Total);
      if (!Rueda) { this.Fijarestado({ Proyecto: Proyecto }); return; }
      Rueda.Objetivo = Validaciones.Numeroacotado(Objetivo, -100000, 100000, Proyecto);
      Rueda.Retenida = false;
      if (Proyecto !== ((this.Estado && this.Estado.Proyecto) || 0)) this.Fijarestado({ Proyecto: Proyecto });
      if (this.Movimientoreducido()) {
        Rueda.Posicion = Rueda.Objetivo;
        Rueda.Velocidad = 0;
        this.Colocarrueda();
        return;
      }
      this.Animarrueda();
    },

    Pixelesporcartel() {
      const Referencia = this.Nodostarjeta.find((N) => N);
      const Lado = Referencia ? Referencia.offsetWidth : 90;
      return Lado * Factorradio * Pasoradianes * 1.25;
    },

    Girarcartel(Paso) {
      if (!Number.isFinite(Paso)) return;
      this.Nodostarjeta.forEach((N) => { if (N) this.Limpiarcartel(N); });
      const Rueda = this.Rueda;
      if (!Rueda) {
        const Total = this.Tarjetas.length;
        this.Fijarestado((Previo) => ({ Proyecto: Validaciones.Enteromodulo((Previo.Proyecto || 0) + Paso, Total) }));
        return;
      }
      this.Fijarobjetivo(Rueda.Objetivo + Paso);
    },

    Pulsarcartel(Indice) {
      if (!Number.isInteger(Indice) || Indice < 0 || Indice >= this.Tarjetas.length) return;
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
      if (!Validaciones.Espropio(Teclas, Evento.key)) return;
      Evento.preventDefault();
      this.Girarcartel(Teclas[Evento.key]);
      const Nuevo = this.Nodostarjeta[(this.Estado && this.Estado.Proyecto) || 0];
      if (Nuevo) { try { Nuevo.focus({ preventScroll: true }); } catch (Error) {} }
    },

    Inclinarcartel(Indice, Evento) {
      if (!Number.isInteger(Indice) || Indice < 0 || Indice >= this.Tarjetas.length) return;
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
      if (!Number.isInteger(Indice) || Indice < 0 || Indice >= this.Tarjetas.length) return;
      const Nodo = this.Nodostarjeta[Indice];
      if (Nodo) this.Limpiarcartel(Nodo);
    },

    Empezarcartel(Evento) {
      if ((Evento.button && Evento.button !== 0) || !this.Rueda) return;
      const Estado = this.Estado || {};
      if (Estado.Palabra || Estado.Saliendo) return;
      this.Rueda.Arrastre = {
        Id: Evento.pointerId, X: Evento.clientX, Y: Evento.clientY,
        Inicio: this.Rueda.Posicion, Ultimox: Evento.clientX, Ultimotiempo: Evento.timeStamp, Activo: false
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
      this.Arrastradocartel = true;
      this.Esperar(80, () => { this.Arrastradocartel = false; });

      if (Evento.timeStamp - Arrastre.Ultimotiempo > 90) Rueda.Velocidad = 0;
      const Proyeccion = Rueda.Posicion + Limitar(Rueda.Velocidad, -9, 9) * 0.12;
      const Objetivo = Limitar(Math.round(Proyeccion), Math.round(Rueda.Posicion) - 2, Math.round(Rueda.Posicion) + 2);
      this.Fijarobjetivo(Objetivo);
    },

    Cancelarcartel() {
      if (this.Rueda && this.Rueda.Arrastre && !this.Rueda.Arrastre.Activo) this.Rueda.Arrastre = null;
    },

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
  });

  var Metodosllamada = Validaciones.Congelar({
    Mostrarcontacto(Evento) {
      const Estado = this.Estado || {};
      if (Estado.Contacto) return;
      let Origen = null;
      try {
        const Objetivo = Evento && Evento.currentTarget ? Evento.currentTarget : this.Botoncontacto;
        if (Objetivo) {
          const Caja = Objetivo.getBoundingClientRect();
          const Aro = Objetivo.querySelector('.Aro');
          const Cajaaro = Aro ? Aro.getBoundingClientRect() : Caja;
          Origen = { X: Cajaaro.left + Cajaaro.width / 2, Y: Cajaaro.top + Cajaaro.height / 2 };
        }
      } catch (Error) {}
      if (!Origen) Origen = { X: window.innerWidth - 80, Y: 38 };
      this.Botonorigen = Evento && Evento.currentTarget ? Evento.currentTarget : this.Botoncontacto;
      this.Llamada = null;
      this.Fijarestado({ Contacto: 'Abre', Textosllamada: false, Origenx: Math.round(Origen.X), Origeny: Math.round(Origen.Y), Menuabierto: false });
    },

    Ocultarcontacto() {
      if (!this.Estado || !this.Estado.Contacto || this.Estado.Contacto === 'Cierra') return;
      if (this.Cuadrollamada) { cancelAnimationFrame(this.Cuadrollamada); this.Cuadrollamada = null; }
      const Devolverfoco = () => {
        try { if (this.Botonorigen) this.Botonorigen.focus({ preventScroll: true }); } catch (Error) {}
      };
      if (this.Movimientoreducido()) { this.Fijarestado({ Contacto: '' }); Devolverfoco(); return; }
      this.Fijarestado({ Contacto: 'Cierra' });
      this.Esperar(580, () => { this.Fijarestado({ Contacto: '' }); Devolverfoco(); });
    },

    Iniciarllamada(Final) {
      const N = this.Nodosllamada;
      if (!N.Mundo || !N.Escena || !N.Grupo || !N.Cablelargo || !N.Svglargo) return;
      const Ancho = window.innerWidth;
      const Alto = window.innerHeight;
      const Proporcion = Ancho / Alto;
      const Apaisado = Proporcion >= 1.15;
      const Ancha = Proporcion > 1.95;
      let Anchoescena = Ancho * 1.75;
      let Izquierda = 0;
      if (Ancha) {
        Anchoescena = Alto * 1.04 * 1076 / 620;
        Izquierda = -0.03 * Anchoescena;
      } else if (Apaisado) {
        Anchoescena = Math.max(Ancho, Alto * 1076 / 620);
        Izquierda = (Ancho - Anchoescena) / 2;
      } else {
        Izquierda = (Ancho - Anchoescena) / 2 + Ancho * 0.07;
      }
      const Altoescena = Anchoescena * 620 / 1076;
      const Arriba = Alto * 3 - Altoescena;
      const K = Anchoescena / 1076;
      if (N.Textos) N.Textos.style.setProperty('--Bloqueizquierda', Ancha ? Math.round(Izquierda + Anchoescena * 0.72 + 24) + 'px' : '51%');
      N.Mundo.style.width = Ancho + 'px';
      N.Mundo.style.height = (Alto * 3) + 'px';
      N.Svglargo.setAttribute('viewBox', '0 0 ' + Ancho + ' ' + (Alto * 3));
      N.Svglargo.setAttribute('width', String(Ancho));
      N.Svglargo.setAttribute('height', String(Alto * 3));
      N.Escena.style.left = Izquierda + 'px';
      N.Escena.style.top = Arriba + 'px';
      N.Escena.style.width = Anchoescena + 'px';
      N.Escena.style.height = Altoescena + 'px';
      const Punto = (X, Y) => ({ x: Izquierda + X * K, y: Arriba + Y * K });
      const Estado = this.Estado || {};
      const Inicio = { x: Estado.Origenx || Ancho - 80, y: Estado.Origeny || 38 };
      const Destinocable = Punto(706, 600);
      const Guia = Geometria.Curva([Inicio, { x: Ancho * 0.8, y: Alto * 0.72 }, { x: Ancho * 0.22, y: Alto * 1.45 }, { x: Ancho * 0.74, y: Alto * 2.2 }, { x: Destinocable.x + 40 * K, y: Destinocable.y - 140 * K }, Destinocable], 90);
      const Radio = Math.max(4.5, 7.5 * K);
      const Largo = Guia[Guia.length - 1].s;
      const Vueltas = Largo / (Radio * 1.9);
      N.Cablelargo.setAttribute('d', Geometria.Espiral(Guia, Vueltas, Radio, 0));
      N.Cablelargobrillo.setAttribute('d', Geometria.Espiral(Guia, Vueltas, Radio, -Math.max(0.8, 1.1 * K)));
      N.Cablelargo.setAttribute('stroke-width', String(Math.max(2.6, 4.2 * K)));
      N.Cablelargobrillo.setAttribute('stroke-width', String(Math.max(0.9, 1.3 * K)));
      let Longitud = 1;
      try { Longitud = N.Cablelargo.getTotalLength(); } catch (Error) {}
      [N.Cablelargo, N.Cablelargobrillo].forEach((Camino) => {
        Camino.style.strokeDasharray = Longitud + ' ' + Longitud;
        Camino.style.strokeDashoffset = String(Longitud);
      });

      const Zoomfoco = Apaisado ? 1.6 : 2.0;
      const Mediaaltura = (Alto / 2) / (Zoomfoco * K);
      const Focoy = Math.min(Apaisado ? 424 : 400, 620 - Mediaaltura);
      this.Llamada = {
        Ancho: Ancho, Alto: Alto, K: K, Guia: Guia, Longitud: Longitud,
        Foco: Punto(521, Focoy), Zoomfoco: Zoomfoco,
        Centrofinal: { x: Ancho / 2, y: Alto * 2.5 },
        Inicio: null
      };

      if (Final || this.Movimientoreducido() || (this.Estado && this.Estado.Contacto === 'Abierto')) {
        this.Pintarllamada(99999);
        if (!this.Estado.Textosllamada) this.Fijarestado({ Textosllamada: true, Contacto: 'Abierto' });
        return;
      }
      if (this.Cuadrollamada) cancelAnimationFrame(this.Cuadrollamada);
      const Paso = (Ahora) => {
        if (!this.Llamada) return;
        if (this.Llamada.Inicio === null) this.Llamada.Inicio = Ahora;
        const T = Ahora - this.Llamada.Inicio;
        this.Pintarllamada(T);
        if (T > 2950 && !this.Estado.Textosllamada) this.Fijarestado({ Textosllamada: true });
        if (T < 3700) { this.Cuadrollamada = requestAnimationFrame(Paso); } else { this.Cuadrollamada = null; this.Fijarestado({ Contacto: 'Abierto' }); }
      };
      this.Cuadrollamada = requestAnimationFrame(Paso);
    },

    Pintarllamada(T) {
      const L = this.Llamada;
      const N = this.Nodosllamada;
      if (!L || !N.Mundo) return;
      const Limitar = (V) => Math.max(0, Math.min(1, V));
      const Suave = (A, B, V) => { const X = Limitar((V - A) / (B - A)); return X * X * (3 - 2 * X); };
      const Entradasalida = (V) => (V < 0.5 ? 4 * V * V * V : 1 - Math.pow(-2 * V + 2, 3) / 2);
      const Rebote = (V) => { const Factora = 1.3, Factorb = Factora + 1; return 1 + Factorb * Math.pow(V - 1, 3) + Factora * Math.pow(V - 1, 2); };
      const Mezcla = (A, B, V) => A + (B - A) * V;

      const P = Entradasalida(Limitar((T - 180) / 1950));
      const Offset = L.Longitud * (1 - P);
      N.Cablelargo.style.strokeDashoffset = String(Offset);
      N.Cablelargobrillo.style.strokeDashoffset = String(Offset);
      const Meta = P * L.Guia[L.Guia.length - 1].s;
      let Indice = 1;
      while (Indice < L.Guia.length - 1 && L.Guia[Indice].s < Meta) Indice += 1;
      const Punta = L.Guia[Indice];
      const Seguir = { x: L.Ancho / 2, y: Math.max(L.Alto / 2, Math.min(L.Alto * 2.5, Punta.y)) };
      const Acercar = Suave(0.6, 1, P);
      let Cx = Mezcla(Seguir.x, L.Foco.x, Acercar);
      let Cy = Mezcla(Seguir.y, L.Foco.y, Acercar);
      let Zoom = Mezcla(1, L.Zoomfoco, Acercar);

      const Apretar = Math.sin(Math.PI * Limitar((T - 2150) / 330));
      const Q = Limitar((T - 2480) / 1100);
      const Qcamara = Entradasalida(Q);
      if (Q > 0) {
        Cx = Mezcla(L.Foco.x, L.Centrofinal.x, Qcamara);
        Cy = Mezcla(L.Foco.y, L.Centrofinal.y, Qcamara);
        Zoom = Mezcla(L.Zoomfoco, 1, Qcamara);
      }
      N.Mundo.style.transform = 'translate(' + (L.Ancho / 2 - Cx * Zoom).toFixed(1) + 'px, ' + (L.Alto / 2 - Cy * Zoom).toFixed(1) + 'px) scale(' + Zoom.toFixed(4) + ')';

      const Presencia = 1 - Suave(0.1, 0.65, Q);
      N.Cablelargo.style.opacity = Presencia.toFixed(3);
      N.Cablelargobrillo.style.opacity = (Presencia * 0.55).toFixed(3);
      const Qg = Q > 0 ? Rebote(Q) : 0;
      const Reposo = { X: 82, Y: 145, R: 27.3, S: 0.55 };
      const Gx = Mezcla(Reposo.X, 0, Qg), Gy = Mezcla(Reposo.Y, 0, Qg), Gr = Mezcla(Reposo.R, 0, Qg);
      const Gs = Mezcla(Reposo.S, 1, Qg) * (1 - 0.035 * Apretar);
      N.Grupo.style.transform = 'translate(' + (Gx * L.K).toFixed(2) + 'px, ' + (Gy * L.K).toFixed(2) + 'px) rotate(' + Gr.toFixed(3) + 'deg) scale(' + Gs.toFixed(4) + ')';

      const M = { x: 439, y: 207 };
      const B = { x: 256, y: 286 };
      const Rad = Gr * Math.PI / 180;
      const Dx = (B.x - M.x) * Gs, Dy = (B.y - M.y) * Gs;
      const Bp = { x: M.x + Dx * Math.cos(Rad) - Dy * Math.sin(Rad) + Gx, y: M.y + Dx * Math.sin(Rad) + Dy * Math.cos(Rad) + Gy };
      const A = { x: 352, y: 528 };
      const Guia = Geometria.Bezier(Bp, { x: Bp.x - 34, y: Bp.y + 150 }, { x: A.x - 170, y: A.y + 40 }, A, 80);
      if (N.Cablecorto) N.Cablecorto.setAttribute('d', Geometria.Espiral(Guia, 30, 8.5, 0));
      if (N.Cablecortobrillo) N.Cablecortobrillo.setAttribute('d', Geometria.Espiral(Guia, 30, 8.5, -1.3));
    }
  });

  var Uiinteracciones = Validaciones.Congelar({
    Geometria: Geometria,
    Utilidades: Utilidades,
    Motorreactivo: Motorreactivo,
    Metodostransiciones: Metodostransiciones,
    Metodosvitrina: Metodosvitrina,
    Metodosllamada: Metodosllamada
  });

  window.Geometria = Geometria;
  window.Utilidades = Utilidades;
  window.Motorreactivo = Motorreactivo;
  window.Metodostransiciones = Metodostransiciones;
  window.Metodosvitrina = Metodosvitrina;
  window.Metodosllamada = Metodosllamada;
  window.Uiinteracciones = Uiinteracciones;
})();
