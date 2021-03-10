export const state = () =>({
    LOAD_ORDENES: false,
    DATA_ORDENES: [],
    DATA_ORDENES_PENDIENTES:[]
})

export const mutations = {
    cargar_DATA_ORDENES(state){
        state.LOAD_ORDENES = true;
        this.$axios.get('ordenes_entrega/venta').then((res)=>{
            state.DATA_ORDENES = res.data.ordenes;
            state.LOAD_ORDENES = false;
        })
    },
    cargar_DATA_PENDIENTES(state){
        state.LOAD_ORDENES = true;
        this.$axios.get('ordenes_entregas/venta/pendientes').then((res)=>{
            state.DATA_ORDENES_PENDIENTES = res.data.ordenes;
            state.LOAD_ORDENES = false;
        })
    }
}
