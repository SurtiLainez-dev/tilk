export const state = () => ({
    LOADCOLABORADORES: false,
    COLABORADORES: [],
    COLABORADORES2: [],
    VISTA: 0,
});

export const mutations = {
    cargar_COLABORADORES(state) {
        if (state.COLABORADORES.length === 0){
            state.LOADCOLABORADORES = true;
            state.COLABORADORES2    = [];
            this.$axios.get('colaboradores_2').then((res)=>{
                state.COLABORADORES     = res.data.colaboradores;
                res.data.colaboradores.forEach(item=>{
                    state.COLABORADORES2.push({
                        value: item.id,
                        text: item.nombres+' '+item.apellidos
                    })
                })
                state.LOADCOLABORADORES = false;
            })
        }
    },
    cambiar_VISTA(state, val){
        state.VISTA = val;
    }
}
