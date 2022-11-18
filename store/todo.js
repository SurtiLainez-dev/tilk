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
    LOAD_ESTADOS: false,
    ESTADOS: []
});

export const mutations = {
    asignar_GRUPO(state, data){
        state.GRUPO.color = data.color;
        state.GRUPO.nombre = data.nombre;
        state.GRUPO.tipo = data.tipo;
        state.GRUPO.id = data.id;
    },
    asignar_TITULO(state, titulo){
        state.TITULO = titulo;
    },
    cambiar_VISTA(state, vista){
        state.VISTA = vista;
    },
    cargar_GRUPOS(state){
        state.LOAD_GRUPOS = true;
        this.$axios.get('to_do/grupos').then((res)=>{
            state.GRUPOS = res.data.grupos;
            state.LOAD_GRUPOS = false;
        })
    },
    cargar_ESTADOS(state){
        state.LOAD_ESTADOS = true;
        this.$axios.get('to_do/estados').then((res)=>{
            state.ESTADOS = res.data.estados;
            state.LOAD_ESTADOS = false;
        })
    },
}
