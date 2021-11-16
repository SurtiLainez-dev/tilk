export default function RedirectLogin({redirect, store, route, $axios}) {
    if (localStorage.getItem('token')){
        if (!store.state.token){
            store.commit("guardarToken", localStorage.getItem('token'));
            store.commit("solicitud_credito/guardarToken", localStorage.getItem('token'));
            store.commit("guardarUsuario", localStorage.getItem('usuario'));
            store.commit("guardarTipoUsuario", localStorage.getItem('tipoUsuario'));
            store.commit("guardarSucursal", localStorage.getItem('sucursal'));
            store.commit("guardarEstadoUsuario", localStorage.getItem('estadoUsuario'));
            store.commit("guardarPermisos", localStorage.getItem('permisosUser'));
            store.commit("guardarColaborador", localStorage.getItem('colaborador'));
            store.commit("guardarMiniToken", localStorage.getItem('miniToken'));
            store.commit("guardarConexion", localStorage.getItem('guardarConexion'))
            store.commit("asignarIdSucursal", localStorage.getItem('sucursal_id'))
            store.commit("guardarUsuarioId", localStorage.getItem('usuario_id'));
            $axios.defaults.baseURL = localStorage.getItem('guardarConexion')
            $axios.setToken(store.state.token, 'Bearer')
        }else{
            console.log("el token no se puso")
        }
    }
}
