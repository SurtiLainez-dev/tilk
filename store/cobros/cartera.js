export const state = () =>({
    VISTA:           1,
    PORTAFOLIOS:     [],
    LOADPORTAFOLIOS: false,
    PORTAFOLIO:      {},
});

export const mutations = {
    asignar_CARTERA(state, data){
        state.CARTERA = data;
    },
    asignar_PORTAFOLIO(state, data){
        state.PORTAFOLIO = data;
    },
    cargar_PORTAFOLIOS(state){
      state.LOADPORTAFOLIOS = true;
      this.$axios.get('cobros/portafolios').then((res)=>{
          state.PORTAFOLIOS     = res.data.portafolios;
          state.LOADPORTAFOLIOS = false;
      })
    },
    cambiar_VISTA(state, val){
        state.VISTA = val;
    }
}
