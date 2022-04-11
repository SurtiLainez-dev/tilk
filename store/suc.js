export const state = () => ({
    LOAD_SUCURSALES: false,
    SUCURSALES: []
});

export const mutations = {
    cargar_SUCURSALES(state) {
        if (state.SUCURSALES.length === 0){
            state.LOAD_SUCURSALES = true;
            this.$axios.get('sucursales').then((res)=>{
                state.SUCURSALES = res.data.suc;
                state.LOAD_SUCURSALES = false;
            })
        }
    }
}
