export const state = () => ({
    VISTA: 1,
    TITULO: 'Combos'
});
export const mutations = {
    cambiar_VISTA(state, val){
        state.VISTA = val;
    },
    cambiar_TITULO(state, titulo){
        state.TITULO = titulo;
    }
}
