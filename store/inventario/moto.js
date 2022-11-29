export const state = () => ({
    VISTA: 1,
    MOTOS: [],
    LOAD_MOTOS: false
});
export const mutations = {
    cambiar_VISTA(state, val){
        state.VISTA = val;
    },
    cargar_MOTOS(state){
        state.LOAD_MOTOS = true;
        this.$axios.get('/2.0/motos_s_notificar').then((res)=>{
            state.MOTOS = res.data.motos;
            state.LOAD_MOTOS = false;
        })
    }
}
