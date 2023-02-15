export const state = () => ({
    VISTA: 1,
    ORDEN: {},
    ORDENES: [],
    LOAD_ORDENES: false,
    GUIA_REMISION: {},
    INFO_ORDEN: {}
});
export const mutations = {
    asignar_GUIAREMISION(state, data){
        state.GUIA_REMISION = data;
    },
    asignar_INFOORDEN(state, data){
      state.INFO_ORDEN = data;
    },
    cambiar_VISTA(state, val){
      state.VISTA = val;
    },
    cargar_ORDEN(state, orden){
      this.$axios.get('ordenes_entrada/'+orden).then((res)=>{
         state.ORDEN        = res.data.orden;
         state.VISTA        = 2;
      });
    },
    cargar_ORDENES(state){
        state.LOAD_ORDENES = true;
        this.$axios.get('ordenes_entrada').then((res)=>{
            state.ORDENES      = res.data.ordenes;
            state.LOAD_ORDENES = false;
        })
    },
}
