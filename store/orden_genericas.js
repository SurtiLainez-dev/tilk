export const state = () => ({
    ORDENES: [],
    LOAD_ORDENES: false,
    MIS_ORDENES: []
})

export const mutations = {
    cargar_ORDENES(state){
        state.LOAD_ORDENES = true;
        this.$axios.get('ordenes_entrega_genericas').then((res)=>{
            state.ORDENES = res.data.ordenes;
            state.LOAD_ORDENES = false;
        })
    },
    cargar_MISORDENES(state){
        state.LOAD_ORDENES = true;
        this.$axios.get('mis_ordenes_entrega_genericas').then((res)=>{
            state.MIS_ORDENES = res.data.ordenes;
            state.LOAD_ORDENES = false;
        })
    }
}
