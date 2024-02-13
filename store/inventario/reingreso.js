export const state = () => ({
    LOAD_REINGRESOS: false,
    REINGRESOS:      [],
    VISTA:           1,
    REINGRESO:       {}
})

export const mutations = {
    cargar_REINGRESOS(state, tipo){
        state.LOAD_REINGRESOS = true;
        this.$axios.get('/2.0/inventario_reingreso/tipo/'+tipo.tipo+'/tipo_consulta/'+tipo.consulta).then((res)=>{
            if (tipo.consulta === 1)
                state.REINGRESOS  = res.data.inventario;
            else if (tipo.consulta === 2) {
                state.REINGRESO = res.data.inventario;
                state.VISTA     = 2;
            }
            state.LOAD_REINGRESOS = false;
        })
    },
    cambiar_VISTA(state, val){
        state.VISTA = val;
    },
}
