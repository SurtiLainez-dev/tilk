export const state = () => ({
    Seguimientos_view: false
})

export const mutations = {
    habilitarView(state, val){
        state.Seguimientos_view = val;
    }

}
