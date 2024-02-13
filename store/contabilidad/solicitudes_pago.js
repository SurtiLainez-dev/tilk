export const state = () => ({
    SOLICITUDES:     [],
    LOADSOLICITUDES: false,
    SOLICITUD:       {},
    VISTA:           1
})

export const mutations = {
    cargarSOLICITUDES(state) {
        state.LOADSOLICITUDES = true;
        this.$axios.get('contabilidad/formato_pago/solicitudes_pago').then((res)=>{
            state.SOLICITUDES     = res.data.solicitudes;
            state.LOADSOLICITUDES = false;
        })
    },
    cambiarVISTA(state, val){
        state.VISTA = val;
    },
    setSOLICITUD(state, data){
        state.SOLICITUD = data;
    }
}
