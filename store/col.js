export const state = () => ({
    LOADCOLABORADORES: false,
    COLABORADORES: []
});

export const mutations = {
    cargar_COLABORADORES(state) {
        state.LOADCOLABORADORES = true;
        this.$axios.get('colaboradores_2').then((res)=>{
            state.COLABORADORES     = res.data.colaboradores;
            state.LOADCOLABORADORES = false;
        })
    }
}
