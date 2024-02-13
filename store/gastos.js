export const state = () => ({
    LOAD_GASTOS: false,
    GASTOS:     [],
    LOAD_HISTORIAL: false,
    HISTORIAL:  []
})

export const mutations = {
    cargarGastos(state, data){
        state.LOAD_GASTOS = true;
        this.$axios.get('contabilidad/facturas_gastos/fi/'+data.fecha_inicio+'/ff/'+data.fecha_final+'/caja_chica/'+data.caja_chica_id).then((res)=>{
            state.GASTOS      = res.data.gastos;
            state.LOAD_GASTOS = false;
        })
    }
}
