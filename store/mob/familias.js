export const state = () => ({
    VISTA:              1,
    FAMILIAS:           [],
    MARCAS:             [],
    MODELOS:            [],
    MOBILIARIOS:        [],
    TRASLADOS:          [],
    TRASLADO:           [],
    USOS:               [],
    MANTENIMIENTOS:     [],
    MOBILIARIO:         null,
    LOADFAMILIAS:       false,
    LOADMARCAS:         false,
    LOADMODELOS:        false,
    LOADMIBILIARIOS:    false,
    LOADTRASLADOS:      false,
    LOADUSOS:           false,
    LOADMANTENIMIENTOS: false
})

export const mutations = {
    asignar_MOBILIARIO(state, data){
        state.MOBILIARIO = data;
    },
    asignar_TRASLADO(state, data){
      state.TRASLADO = data;
    },
    cambiar_VISTA(state, val){
       state.VISTA = val;
    },
    cargar_FAMILIAS(state){
        state.LOADFAMILIAS = true;
        this.$axios.get('mob/familia').then((res)=>{
            state.FAMILIAS     = res.data.familias;
            state.LOADFAMILIAS = false;
        })
    },
    cargar_MARCAS(state){
        state.LOADMARCAS = true;
        this.$axios.get('mob/marcas').then((res)=>{
            state.MARCAS     = res.data.marcas
            state.LOADMARCAS = false;
        })
    },
    cargar_MODELOS(state){
        state.LOADMODELOS = true;
        this.$axios.get('mob/modelos').then((res)=>{
            state.MODELOS = res.data.modelos;
            state.LOADMODELOS = false;
        })
    },
    cargar_MOBILIARIOS(state){
        state.LOADMIBILIARIOS = true;
        this.$axios.get('mob/mobiliarios').then((res)=>{
            state.MOBILIARIOS     = res.data.mobiliarios;
            state.LOADMIBILIARIOS = false;
        })
    },
    cargar_TRASLADOS(state){
        state.LOADTRASLADOS = true;
        this.$axios.get('mob/mobiliarios/traslados').then((res)=>{
            state.TRASLADOS     = res.data.traslados;
            state.LOADTRASLADOS = false
        })
    },
    cargar_USOS(state){
      state.LOADUSOS = true;
      this.$axios.get('mob/mobiliarios/usos').then((res)=>{
          state.USOS     = res.data.usos;
          state.LOADUSOS = false;
      })
    },
    asignar_etiquetas_MOBILIARIO(state, val){
        state.MOBILIARIO = val;
    },
    cargar_MANTENIMIENTOS(state){
        state.LOADMANTENIMIENTOS = true;
        this.$axios.get('mob/mobiliarios/mantenimientos').then((res)=>{
            state.MANTENIMIENTOS     = res.data.mantenimientos;
            state.LOADMANTENIMIENTOS = false;
        })
    }
}
