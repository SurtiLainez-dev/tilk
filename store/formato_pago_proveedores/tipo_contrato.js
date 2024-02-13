export const state = () => ({
    TIPOCONTRATOS:     [],
    LOADTIPOCONTRATOS: false,
    NOMBRE: '',
    DIALOGO: false,
    URLFORMATOPAGO: 'contabilidad/formato_pago/'
})

export const mutations = {
    cargar_TIPOCONTRATOS(state){
        state.LOADTIPOCONTRATOS = true;
        this.$axios.get(state.URLFORMATOPAGO+'tipo_contrato').then((res)=>{
            state.TIPOCONTRATOS = res.data.tipos;
            state.LOADTIPOCONTRATOS = false;
        })
    },
    setNOMBRE(state, val){
        state.NOMBRE = val;
    },
    setDIALOGO(state, val){
        state.DIALOGO = val;
    },
}
