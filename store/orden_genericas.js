export const state = () => ({
    ORDENES: [],
    LOAD_ORDENES: false
})

export const mutations = {
    cargar_ORDENES(state){
        state.LOAD_ORDENES = true;
        this.$axios.get('ordenes_entrega_genericas').then((res)=>{
            state.ORDENES = res.data.ordenes;
            state.LOAD_ORDENES = false;
        })
    }
}
