export const state = () => ({
    DEPOSITOS:     [],
    LOADDEPOSITOS: false,
    DEPOSITO:      {}
})

export const mutations = {
    asignar_DEPOSITO(state, deposito) {
        state.DEPOSITO = deposito;
    },
    cargar_DEPOSITOS(state){
        state.LOADDEPOSITOS = true;
        this.$axios.get('caja/depositos_clientes/nc').then((res)=>{
            state.DEPOSITOS     = res.data.depositos;
            state.LOADDEPOSITOS = false;
        })
    }
}
