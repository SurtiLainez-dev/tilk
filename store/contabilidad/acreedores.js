export const state = () => ({
    NOMBRE: '',
    IDENTIFICACION: '',
    DIALOGO: false,
    LOAD_ACREEDORES: false,
    ACREEDORES: [],
    TIPO: 1
})

export const mutations = {
    cargarACREEDORES(state){
        state.LOAD_ACREEDORES = true;
        this.$axios.get('contabilidad/acreedores').then((res)=>{
            state.ACREEDORES      = res.data.acreedores;
            state.LOAD_ACREEDORES = false;
        })
    },
    setDIALOGO(state, val){
        state.DIALOGO = val;
    },
    setIDENTIFICACION(state, val){
        state.IDENTIFICACION = val
    },
    setNOMBRE(state, val){
        state.NOMBRE = val
    },
    aetTipo(state, val){
        state.TIPO = val;
    }
}
