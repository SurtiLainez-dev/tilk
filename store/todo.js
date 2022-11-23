import {data} from "autoprefixer";

export const state = () => ({
    TITULO: '',
    VISTA: 1,
    LOAD_GRUPOS: false,
    GRUPOS: [],
    GRUPO: {
        color: '#FF0000FF',
        nombre: '',
        id: 0,
        tipo: 1
    },
    TAREA:{
      titulo: '',
      detalle: '',
      estado_id: '',
      grupo_id: '',
      user: [],
      archivos: [],
      checklist: [],
      links: [],
      fecha_inicio: '',
      fecha_finalizacion: '',
      tarea: 0,
      tipo: 1
    },
    LOAD_ESTADOS: false,
    ESTADOS: [],
    TAREAS: [],
    LOAD_TAREAS: false,
    VISTA_TAREA: 0, //Maneja las vistas principales
    VISTA_VIEW: 1,  //Maneja la vista de mostrar las tareas y la informacion de la tareas
    VISTA_INFO: 1, //Maneja las vistas dentro de la informacion de tareas
    INFO: {}
});

export const mutations = {
    asignar_GRUPO(state, data){
        state.GRUPO.color = data.color;
        state.GRUPO.nombre = data.nombre;
        state.GRUPO.tipo = data.tipo;
        state.GRUPO.id = data.id;
    },
    asignar_TAREA(state, data){
        state.titulo = data.titulo;
        state.detalle = data.detalle;
        state.fecha_inicio = data.fecha_inicio;
        state.fecha_finalizacion = data.fecha_finalizacion;
        state.user    = data.user;
        state.grupo = data.grupo;
        state.estado = data.estado;
        state.links     = data.links;
        state.archivos     = data.archivos;
        state.checklist    = data.checklist;
        state.tipo      = data.tipo;
        state.tarea     = data.tarea;

    },
    asignar_VISTATAREA(state, vista){
        state.VISTA_TAREA = vista;
    },
    asignar_TAREAINFO(state, data){
        state.INFO = data;
    },
    asignar_TITULO(state, titulo){
        state.TITULO = titulo;
    },
    cambiar_VISTA(state, vista){
        state.VISTA = vista;
    },
    cambiar_VISTAVIEW(state, vista){
        state.VISTA_VIEW = vista;
    },
    cambiar_VISTAINFO(state, vista){
      state.VISTA_INFO = vista;
    },
    cargar_ESTADOS(state){
        state.LOAD_ESTADOS = true;
        this.$axios.get('to_do/estados').then((res)=>{
            state.ESTADOS = res.data.estados;
            state.LOAD_ESTADOS = false;
        })
    },
    cargar_GRUPOS(state){
        state.LOAD_GRUPOS = true;
        this.$axios.get('to_do/grupos').then((res)=>{
            state.GRUPOS = res.data.grupos;
            state.LOAD_GRUPOS = false;
        })
    },
    cargar_TAREAS(state, $user){
        state.LOAD_TAREAS = true;
        this.$axios.get('to_do/tareas/user/'+$user).then((res)=>{
            state.TAREAS = [];
            res.data.tareasP.forEach((item)=>{
                state.TAREAS.push(item);
            })
            res.data.tareasA.forEach((item)=>{
                state.TAREAS.push(item);
            })
            state.LOAD_TAREAS = false;
        })
    }
}
