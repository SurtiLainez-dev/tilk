export const state = () => ({
    TITULO: 'Inicio de Cobros',
    VISTA:  1
})

export const mutations = {
    cambiar_TITULO(state, titulo){
        state.TITULO = titulo;
    },
    cambiar_VISTA(state, vista){
        state.VISTA = vista;
    }
}
