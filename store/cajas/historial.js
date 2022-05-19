export const state = () => ({
    SUCURSALES: [],
    SUCURSAL:   {},
    LOADSUCURSALES: false,
    LOADSUCURSAL: {},
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
    }
}
