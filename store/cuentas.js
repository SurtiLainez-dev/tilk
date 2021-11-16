export const state = () => ({
    CUENTAS: [],
    CUENTA:  {},
    VISTA:   1,
    PAGOS_AGREGADOS: [],
    LOAD: true,
    CUENTAS_ACEPTADAS: [],
    LOADCUENTA: false
})

export const mutations = {
    agregar_CUENTAS(state, cuentas) {
       state.CUENTAS = cuentas;
    },
    agregar_CUENTA(state, cuenta){
       state.CUENTA = cuenta;
    },
    cambiar_VISTA(state, val){
       state.VISTA = val;
    },
    cargar_PAGOS_AGREGADOS(state, venta_id){
        state.LOAD = true;
        this.$axios.get('cuenta/pagos_extras/'+venta_id).then((res)=>{
            state.PAGOS_AGREGADOS = res.data.pagos;
            state.LOAD = false;
        })
    },
    cargar_CUENTA(state, venta){
        state.LOADCUENTA = true;
        this.$axios.get('cuentas/ventas/'+venta).then((res)=>{
            state.CUENTA     = res.data.venta;
            state.LOADCUENTA = false;
        })
    },
    cargar_CUENTAS_ACEPTADAS(state){
        state.LOAD = true;
        this.$axios.get('cuentas/ventas').then((res)=>{
            state.CUENTAS_ACEPTADAS = res.data.venta;
            state.LOAD = false;
        })
    }
}
