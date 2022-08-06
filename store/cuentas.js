export const state = () => ({
    CUENTAS: [],
    CUENTAS_CANCELADAS: [],
    CUENTA:  {},
    VISTA:   1,
    PAGOS_AGREGADOS: [],
    LOAD: true,
    CUENTAS_ACEPTADAS: [],
    LOADCUENTA: false,
    VENTAS_REV_DOC: [],
    VENTA_REV_DOC: {},
    LOAD_CUENTAS_REV_DOC: false
})

export const mutations = {
    cargar_VENTAS_REV_DOC(state, cuentas){
        state.LOAD_CUENTAS_REV_DOC = true;
        this.$axios.get('ventas/revision_documentos').then((res)=>{
            state.VENTAS_REV_DOC = res.data.ventas;
            state.LOAD_CUENTAS_REV_DOC = false;
        })
    },
    cargar_VENTA_REV_DOC(state, id){
        state.LOAD_CUENTAS_REV_DOC = true;
        this.$axios.get('ventas/revision_documentos/'+id).then((res)=>{
            state.VENTA_REV_DOC = res.data.venta;
            state.LOAD_CUENTAS_REV_DOC = false;
        })
    },
    estado_LOAD_CUENTAS_REV_DOC(state, estado){
      state.LOAD_CUENTAS_REV_DOC = estado;
    },
    agregar_CUENTAS(state, cuentas) {
       state.CUENTAS = cuentas;
    },
    agregar_CUENTAS_CANCELADAS(state,cuentas){
        state.CUENTAS_CANCELADAS = cuentas;
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
