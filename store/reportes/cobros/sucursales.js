export const state = () => ({
    LOADINDEX: false,
    ANIOS:     [],
    VISTA:     1,
    DATOS:     [],
    LOADDATOS: false,
    RGBA:      '',
    GRBABORDER: ''
});

export const mutations = {
    cargar_ANIOS(state){
        state.LOADINDEX = true;
        this.$axios.get('reportes/cobros/sucursales/cargando_anios').then((res)=>{
            state.ANIOS     = res.data.anios;
            state.LOADINDEX = false;
        })
    },
    cargar_DATOS(state,data){
        state.LOADDATOS = true;
        this.$axios.get(`reportes/cobros/sucursales/datos/sucursal/${data.sucursal}/anio/${data.anio}`).then((res)=>{
            if (res.data.datos.length > 0)
                state.DATOS     = res.data.datos;
            else
                state.DATOS = [];

            state.LOADDATOS = false;
        })
    },
    carlular_RGBA(state){
        let num  = Math.floor(Math.random()*19);
        let color1  = [
            '#F300FF',
            '#FF00BD',
            '#FF0000',
            '#001BFF',
            '#900C3F',
            '#fdf2e9',
            '#DAF7A6',
            '#ED92DF',
            '#7FB3D5',
            '#FF6400',
            '#C8F521',
            '#FF5733',
            '#FFF700',
            '#8FFF00',
            '#00FF23',
            '#AAB7B8',
            '#00FFD4',
            '#009EFF',
            '#FFC300',
            '#7000FF'];

        state.RGBA =  color1[num];
    }
}
