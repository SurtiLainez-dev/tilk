export const state = () => ({
    DIA_STRING:'',
    DIA_PLECA: ''
})

export const mutations = {
    agregar_DIA_STRING(state, fecha){
        state.DIA_STRING = fecha;
    },
    agregar_DIA_PLECA(state, fecha){
        state.DIA_PLECA = fecha;
    }
}
