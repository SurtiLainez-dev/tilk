export const state = () => ({
    LOAD_USER:      false,
    USER:           {},
    LOAD_PLANILLAS: false,
    PLANILLAS:      [],
    VISTA:          1
})

export const mutations = {
    cargar_USER(state){
        state.LOAD_USER = true
        this.$axios.post('mi_perfil').then((res)=>{
            state.USER      = res.data.user;
            state.LOAD_USER = false;
        });
    },
    cargar_PLANILLAS(state){
        state.LOAD_PLANILLAS = true;
        this.$axios.get('mi_perfil/planillas/'+state.USER.colaborador.id).then((res)=>{
            state.PLANILLAS      = res.data.planillas;
            state.LOAD_PLANILLAS = false;
        });
    },
    asignar_VISTA(state,val){
        state.VISTA = val;
    }
}
