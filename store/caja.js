export const state = () => ({
    CAJAS: [],
    CAJAS_X_SUCURSAL: [],
    CAJA_ID: null,
    ESTADO: false,
    CAJA: [],
    VISTA: 1,
    CUENTAS: [],
    CUENTA: [],
    TITULO: '',
    LOAD_CUENTAS: true
})

export const mutations = {
    agregar_CUENTA(state, cuenta){
        state.CUENTA = cuenta;
    },
    agregar_CAJAS(state, cajas){
        state.CAJAS = cajas;
    },
    agregar_CAJAS_X_SUCURSAL(state, cajas){
        state.CAJAS_X_SUCURSAL = cajas;
    },
    agregar_CAJA_ID(state, id){
        state.CAJA_ID = id
    },
    agregar_CAJA(state, data){
        state.CAJA = data;
    },
    cambiar_Estado(state, val){
        state.ESTADO = val;
    },
    cambiar_VISTA(state, val) {
        state.VISTA = val;
    },
    cargar_CUENTAS(state) {
        state.LOAD_CUENTAS = true;
        this.$axios.get('cuentas/ventas/pendientes').then((res)=>{
            state.CUENTAS = res.data.ventas
            state.LOAD_CUENTAS = false;
        })
    },
    cambiar_TITULO(state, titulo){
        state.TITULO = titulo
    }
}
