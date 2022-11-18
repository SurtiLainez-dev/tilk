export const state = () => ({
    SUCURSALES: [],
    SUCURSAL:   {},
    LOADSUCURSALES: false,
    LOADSUCURSAL: {},
    LOADCIERRE: false,
    CIERRE: {}
})

export const mutations = {
    cargar_HISTORIAL(state, fecha) {
        state.LOADSUCURSALES = true;
        this.$axios.get('cajas/historial_cierre/'+fecha).then((res)=>{
            state.SUCURSALES = res.data.historial;
            state.LOADSUCURSALES = false;
        })
    },
    asignar_HISTORIAL(state, sucursal){
        state.SUCURSAL = sucursal;
    },
    cargar_CIERRE(state, cierre){
        state.LOADCIERRE = true;
        this.$axios.get('cajas/historial_cierre/cierre/'+cierre).then((res)=>{
            state.SUCURSAL = res.data.cierre;
        });
        state.LOADCIERRE = false;
    }
}
