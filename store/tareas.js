export const state = () => ({
    Tareas_data: [],
    Tareas_load: true,
    Tareas_view: false,
})

export const mutations = {
    cargarTareas(state){
        state.Tareas_load = true;
        this.$axios.get('tareas').then((res)=>{
            state.Tareas_data = res.data.tareas;
            state.Tareas_load = false;
        })
    },
    cambiarValorVista(state, val){
        state.Tareas_view = val
    }
}
