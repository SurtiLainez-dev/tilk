export const state = () =>({
    CLIENTES: [],
    LOAD_CLIENTES: false,
    CLIENTE: [],
    CUENTAS: [],
    SOLICITUDES: [],
    LOAD_CLIENTE: false,
    SOLICITUDES_AVAL: [],
    VISTA: 1
})

export const mutations = {
    cargar_CLIENTES(state){
        state.LOAD_CLIENTES = true;
        this.$axios.get('clientes').then((res)=>{
            state.CLIENTES = res.data.clientes;
            state.LOAD_CLIENTES = false;
        })
    },
    cambiar_VISTA(state, val){
        state.VISTA = val;
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
    },
    agregar_SOLICITUDES_AVAL(state, solicitudes){
        state.SOLICITUDES_AVAL = solicitudes
    }
}
