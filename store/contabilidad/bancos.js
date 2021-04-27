export const state = () => ({
    CUENTAS:     [],
    LOADCUENTAS: false
})

export const mutations = {
    cargar_CUENTAS(state){
        state.LOADCUENTAS = true;
        this.$axios.get('cuentas').then((res)=>{
            state.CUENTAS     = res.data.cuentas;
            state.LOADCUENTAS = false;
        })
    }
}
