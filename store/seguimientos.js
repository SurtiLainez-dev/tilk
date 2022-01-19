export const state = () => ({
    Seguimientos_view: false,
    LOAD_SEGUIMIENTOS: false,
    SEGUIMIENTOS_X_SUCURSAL: [],
})

export const mutations = {
    habilitarView(state, val){
        state.Seguimientos_view = val;
    },
    cargar_SEGUIMIENTOS_X_SUCURSAL(state, sucursal){
        state.LOAD_SEGUIMIENTOS = true;
        this.$axios.get('seguimiento/sucursal/'+sucursal).then((res)=>{
            state.SEGUIMIENTOS_X_SUCURSAL = res.data.seguimientos;
            state.LOAD_SEGUIMIENTOS       = false;
        })
    }
}
