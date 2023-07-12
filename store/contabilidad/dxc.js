export const state = () => ({
    DXCS:     [],
    LOADDXCS: false,
    DXC:      {},
    VISTA:    1
})

export const mutations = {
    cambiar_VISTA(state, val){
      state.VISTA = val;
    },
    cargar_DXC(state, id){
      state.LOADDXCS = true;
      this.$axios.get('dxc/'+id).then((res)=>{
          state.DXC     = res.data.dxc;
          state.LOADDXCS = false;
          state.VISTA   = 2;
      })
    },
    cargar_DXCS(state){
        state.LOADDXCS = true;
        this.$axios.get('dxcs').then((res)=>{
            state.DXCS     = res.data.dxcs;
            state.LOADDXCS = false;
        })
    }
}
