export const state = () => ({
    VISTA: 1,
    SECCIONES: [],
    LOADSECCIONES: false,
    SUBSECCIONES: [],
    SECCION: false
})

export const mutations = {
    cambiarVISTA(state, vista){
        state.VISTA = vista;
    },
    cargarSECCIONES(state){
        state.LOADSECCIONES = true;
        this.$axios.get('manual_seccion').then((res)=>{
            state.SECCIONES     = res.data.secciones;
            state.LOADSECCIONES = false;
        })
    },
    cargarSUBSECCIONES(state){
        state.LOADSECCIONES = true;
        this.$axios.get('manual_secciones').then((res)=>{
            state.SUBSECCIONES  = res.data.secciones;
            state.LOADSECCIONES = false;
        })
    },
    asignarSECCION(state, data){
        state.SECCION = data;
    }
}
