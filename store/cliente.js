export const state = () =>({
    CLIENTES: [],
    LOAD_CLIENTES: false,
    CLIENTE: [],
    CUENTAS: [],
    SOLICITUDES: [],
    LOAD_CLIENTE: false
})

export const mutations = {
    cargar_CLIENTES(state){
        state.LOAD_CLIENTES = true;
        this.$axios.get('clientes').then((res)=>{
            state.CLIENTES = res.data.clientes;
            state.LOAD_CLIENTES = false;
        })
    },
    cargar_CLIENTE(state, cliente){
        state.CLIENTE = [];
        state.LOAD_CLIENTE = true;
        this.$axios.get('clientes/'+cliente).then((res)=>{
            state.CLIENTE          = res.data.cliente;
            state.LOAD_CLIENTE    = false;
        })
    },
    agregar_CUENTAS(state, cuentas){
        state.CUENTAS = cuentas;
    },
    agregar_SOLICITUDES(state, solicitudes){
        state.SOLICITUDES = solicitudes;
    }
}
