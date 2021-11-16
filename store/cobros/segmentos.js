export const state = () => ({
    LOADSEGMENTOS: false,
    SEGMENTOS:     [],
    SEGMENTO:      {}
});

export const mutations = {
    cargar_SEGMENTOS(state){
        state.LOADSEGMENTOS = true;
        this.$axios.get('cobros/segmentos').then((res)=>{
            state.SEGMENTOS = res.data.segmentos;
            state.LOADSEGMENTOS = false;
        })
    },
    asignar_SEGMENTO(state, data){
        state.SEGMENTO = data;
    }
}
