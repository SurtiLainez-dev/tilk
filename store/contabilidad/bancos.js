export const state = () => ({
    CUENTAS:     [],
    LOADCUENTAS: false,
    CUENTA:      {}
})

export const mutations = {
    asignar_CUENTA(state, cuenta) {
      state.CUENTA = cuenta;
    },
    cargar_CUENTAS(state){
        state.LOADCUENTAS = true;
        this.$axios.get('cuentas').then((res)=>{
            state.CUENTAS     = res.data.cuentas;
            state.LOADCUENTAS = false;
        })
    }
}
