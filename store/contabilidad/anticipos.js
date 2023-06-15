export const state = () => ({
    ANTICIPOS:     [],
    LOADANTICIPOS: false,
    ANTICIPO:      {},
    LOADANTICIPO:  false
})

export const mutations = {
    cargar_ANTICIPO(state,anticipo){
      state.LOADANTICIPO = true;
        this.$axios.get('anticipos_cliente/'+anticipo).then((res)=>{
            state.ANTICIPO     = res.data.anticipo;
            state.LOADANTICIPO = false;
        })
    },
    cargar_ANTICIPOS(state){
        state.LOADANTICIPOS = true;
        this.$axios.get('anticipos_cliente').then((res)=>{
            state.ANTICIPOS     = res.data.anticipos;
            state.LOADANTICIPOS = false;
        })
    }
}
