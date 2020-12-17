
export const strict = false;

export const state = () =>({
  token: null,
  conexion: null,
  usuario: null,
  titulo: 'inicio',
  tipoUsuario: null,
  sucursal:null,
  sucursal_id: null,
  estadoUsuario: 0,
  permisosUser: [],
  urlServe: 'http://127.0.0.1:8000/api/',
  estadoMenu: true,
  colaborador: null,
  miniToken: null,
  modalArticulo: false,
  over: false,
  vistaPrecioArticulo: 1,
  vista: 1,
  remisionTraslados: null,
  file: null,
  dialogo: false,
  dialogo2: false,
  Devoluciones: [],
  //lsta de pagos
  listaPagos: false,
  listaPagos_data: [],
  //ventas
  //--seguimiento
  Seguimiento: [],
  Seguimientos: [],
  loadSeguimiento: false,

});

export const mutations = {
  asignarDatosSeguimiento(state, data){
    state.Seguimiento = data
  },
  valorDialogo(state, val){
    state.dialogo = val;
  },
  valorDialogo2(state, val){
    state.dialogo2 = val;
  },
  asignarIdSucursal(state, id){
    state.sucursal_id = id;
  },
  asignarFile(state, file){
    state.file = file
  },
  asiganrRemision(state, data){
    state.remisionTraslados = data
  },
  cambiarVista(state, vista){
    state.vista = vista;
  },
  cambiarVistaPRecioArticulo(state, vista){
    state.vistaPrecioArticulo = vista
  },
  activarOverlay(state, overlay){
    state.over = overlay
  },
  guardarTitulo(state, titulo){
    state.titulo = titulo
  },
  guardarMiniToken(state, token){
      state.miniToken = token
  },
  guardarConexion(state, conexion){
      state.conexion = conexion
  },
  cambiarEstadoMenu(state){
    state.estadoMenu = !state.estadoMenu
  },
  cambiarEstadoModalArticulo(state){
    state.modalArticulo = !state.modalArticulo
  },
  guardarColaborador(state, colaborador){
    state.colaborador = colaborador
  },
  guardarToken(state, token){
    state.token = token
  },
  guardarUsuario(state, user){
    state.usuario = user
  },
  guardarTipoUsuario(state, tipo){
    state.tipoUsuario = tipo
  },
  guardarSucursal(state, sucursal){
    state.sucursal = sucursal
  },
  guardarEstadoUsuario(state, estado){
    state.estadoUsuario = estado;
  },
  guardarPermisos(state, permisos){
    state.permisosUser = permisos
  },
  //funciones
  cargarDevoluciones(state){
    this.$axios.get('devoluciones_proveedor',{
      headers: {
        'Authorization': 'Bearer ' + state.token
      }
    }).then((res)=>{
      state.Devoluciones = res.data.devoluciones
    })
  },
  cargarSeguimientoId(state, ruta){
    state.Seguimiento = [];
    state.loadSeguimiento = true;
    this.$axios.get(ruta).then((res)=>{
      state.Seguimiento  = res.data.seguimiento;
      state.loadSeguimiento = false
    })
  },
  cargarSeguimeintos(state, tipo){
    state.loadSeguimiento = true;
    if (tipo === 1){
      this.$axios.get('seguimiento_x_usuario/',{
        headers: {
          'Authorization': 'Bearer ' + state.token
        }
      }).then((res)=>{
        state.Seguimientos = res.data.seguimientos;
        state.loadSeguimiento = false
      })
    }else if (tipo === 2){
      this.$axios.get('seguimiento_x_usuario/todos',{
        headers: {
          'Authorization': 'Bearer ' + state.token
        }
      }).then((res)=>{
        state.Seguimientos = res.data.seguimientos;
        state.loadSeguimiento = false
      })
    }else  if (tipo === 3){
      this.$axios.get('seguimiento_x_usuario/cerrados',{
        headers: {
          'Authorization': 'Bearer ' + state.token
        }
      }).then((res)=>{
        state.Seguimientos = res.data.seguimientos;
        state.loadSeguimiento = false
      })
    }
  }
};

