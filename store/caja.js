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
    LOAD_CUENTAS: true,
    FACTURA: [],
    FACTURAS_HOY: [],
    LOADFACTURAS_HOY: false,
    RECIBOS_HOY: [],
    LOADRECIBOS_HOY: false,
    DOCUMENTOS_HOY: [],
    LOADDOCUMENTOS_HOY: false,
    LOAD_HISTORIAL: false,
    HISTORIAL: [],
    CAJA_EFECTIVO: 0,
    LOAD_TRANSACCIONES: false,
    TRANSACCIONES: []

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
    cargar_DOCUMENTOS(state,data){

        if (data.tipo === 1)
            state.LOADFACTURAS_HOY   = true;
        else if(state.tipo === 2)
            state.LOADRECIBOS_HOY    = true;
        else if (data.tipo === 3)
            state.LOADDOCUMENTOS_HOY = true;

        this.$axios.get(`caja/documentos/${data.fecha}/caja/${data.caja}/${data.tipo}`).then((res)=>{
            if (data.tipo === 1){
                state.FACTURAS_HOY       = res.data.documentos;
                state.LOADFACTURAS_HOY   = false;
            }else if (data.tipo === 2){
                state.RECIBOS_HOY        = res.data.documentos;
                state.LOADRECIBOS_HOY    = false;
            }else if (data.tipo === 3){
                state.DOCUMENTOS_HOY     = res.data.documentos;
                state.LOADDOCUMENTOS_HOY = false;
            }
            state.CAJA_EFECTIVO = res.data.caja.total;
        });
    },
    cambiar_TITULO(state, titulo){
        state.TITULO = titulo
    },
    cargar_HISTORIAL(state, fecha){
        state.LOAD_HISTORIAL = true;
        this.$axios.get('cajas/'+state.CAJA_ID+'/forma_pagos/fecha/'+fecha).then((res)=>{
            state.HISTORIAL      = res.data.historial;
            state.LOAD_HISTORIAL = false;
        })
    },
    cargar_TRANSACCIONES(state, fecha){
        state.LOAD_TRANSACCIONES = true;
        this.$axios.get('caja/'+state.CAJA_ID+'/historial/'+fecha).then((res)=>{
            state.TRANSACCIONES      = res.data.historial;
            state.LOAD_TRANSACCIONES = false;
        })
    }
}
