export const state = () => ({
    VISTA: 1,
    SOLICITUDES: [],
    LOADSOLICITUDES: false,
    VENTAS: []
})

export const mutations = {
    cambiar_VISTA(state, val){
        state.VISTA = val;
    },
    cargarSOLICITUDES(state, sucursal){
        state.LOADSOLICITUDES = true;
        this.$axios.get('surti_creditos/solicitudes/sucursal/'+sucursal).then((res)=>{
            state.SOLICITUDES     = res.data.solicitudes;
            state.LOADSOLICITUDES = false;
        })
    },
    cargarVENTAS(state, sucursal){
        state.LOADSOLICITUDES = true;
        this.$axios.get('surti_creditos/ventas/sucursal/'+sucursal).then((res)=>{
            state.VENTAS     = res.data.ventas;
            state.LOADSOLICITUDES = false;
        })
    }
}
