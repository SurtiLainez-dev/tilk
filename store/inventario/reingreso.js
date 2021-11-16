export const state = () => ({
    LOAD_REINGRESOS: false,
    REINGRESOS:      [],
    VISTA:           1,
    REINGRESO:       {}
})

export const mutations = {
    cargar_REINGRESOS(state, tipo){
        state.LOAD_REINGRESOS = true;
        this.$axios.get('/2.0/inventario_reingreso/tipo/'+tipo).then((res)=>{
            state.REINGRESOS      = res.data.inventario;
            state.LOAD_REINGRESOS = false;
        })
    },
    cambiar_VISTA(state, val){
        state.VISTA = val;
    },
    asignar_REINGRESO(state, data){
        state.REINGRESO = data;
    }
}
