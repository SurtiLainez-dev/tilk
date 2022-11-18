export const state = () => ({
    VISTA: 1,
    TITULO: 'Combos',
    LOAD_COMBOS: false,
    COMBOS: [],
    COMBO: {}
});
export const mutations = {
    cargar_COMBOS(state){
        state.LOAD_COMBOS = true;
        this.$axios.get('2.0/combos').then((res)=>{
           state.COMBOS = res.data.combos;
           state.LOAD_COMBOS = false
        });
    },
    cambiar_VISTA(state, val){
        state.VISTA = val;
    },
    cambiar_TITULO(state, titulo){
        state.TITULO = titulo;
    },
    cargar_COMBO(state, combo){
        state.LOAD_COMBOS = true;
        this.$axios.get('2.0/combos/'+combo).then((res)=>{
            state.COMBO = res.data.combo;
            state.LOAD_COMBOS = false;
        })
    }
}
