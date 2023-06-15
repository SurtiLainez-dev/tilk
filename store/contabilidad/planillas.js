export const state = () => ({
    PLANILLAS:     [],
    LOADPLANILLAS: false,
    PLANILLA:      {},
    LOADPLANILLA:  false
})

export const mutations = {
    cargar_PLANILLAS(state){
        state.LOADPLANILLAS = true;
        this.$axios.get('/planillas/').then((res)=>{
            state.PLANILLAS     = res.data.planillas;
            state.LOADPLANILLAS = false;
        })
    }
}