import Vue from "vue";
export const state = () => ({
    PORTAFOLIOS:     [],
    LOADPORTAFOLIOS: false,
    PORTAFOLIO:      {},
    LOADPORTAFOLIO:  false,
    VISTA:           1,
    GESTIONES:       [],
    LOADGESTIONES:   false,
    GESTION:         {},
    LOADGESTION:     false,
    VISTAGESTION:    1,
    VISTAEXPANDIR:   1,
    VISTAPORTAFOLIO_GESTION: 1,
    VISTAPORTAFOLIO: 1,
    LOADREPORTE:     false,
    REPORTE:         [],
    AVANCES:         []
})

export const mutations = {
    cargar_REPORTE(state){
        state.LOADREPORTE = true;
        this.$axios.get(`cobros/portafolio/${state.PORTAFOLIO.id}/reportes`).then((res)=>{
            state.REPORTE = res.data.reporte;
            state.LOADREPORTE = false;
        })
    },
    cambiar_VISTAPORTAFOLIO(state, val){
        state.VISTAPORTAFOLIO = val
    },
    asignar_PORTAFOLIO(state, data) {
      state.PORTAFOLIO = data;
    },
    cargar_GESTIONES(state){
      state.LOADGESTIONES = true;
      this.$axios.get(`cobros/portafolio/${state.PORTAFOLIO.id}/gestiones`).then((res)=>{
          state.GESTIONES     = res.data.gestiones;
          state.LOADGESTIONES = false;
      })
    },
    cargar_PORTAFOLIOS(state) {
        state.LOADPORTAFOLIOS = true;
        this.$axios.get('cobros/mi_portafolios').then((res)=>{
            state.PORTAFOLIOS     = res.data.portafolios;
            state.LOADPORTAFOLIOS = false;
        });
    },
    cambiar_VISTA(state, vista){
        state.VISTA = vista
    },
    cambiar_VISTAGESTION(state, vista){
        state.VISTAGESTION =vista;
    },
    cambiar_VISTAEXPANDIR(state, val){
        state.VISTAEXPANDIR = val;
    },
    cargar_PORTAFOLIO(state){
        state.LOADPORTAFOLIO = true;
        this.$axios.get('cobros/portafolio/'+state.PORTAFOLIO.id).then((res)=>{
            state.PORTAFOLIO = res.data.portafolio;
            state.AVANCES    = res.data.avances;
            state.LOADPORTAFOLIO = false
        })
    },
    cambiar_VISTAGESTION_GESTION(state, val){
        state.VISTAPORTAFOLIO_GESTION = val;
    },
    cargar_GESTION(state){
        state.LOADGESTION = true;
        this.$axios.get('cobros/gestion/'+state.GESTION.id).then((res)=>{
            state.GESTION     = res.data.gestion;
            state.LOADGESTION = false;
        })
    },
    cambiar_GESTION(state, data){
        state.GESTION = data;
    },
}

