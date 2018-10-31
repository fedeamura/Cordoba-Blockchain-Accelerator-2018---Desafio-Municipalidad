import { USUARIO_LOGIN, USUARIO_CERRAR_SESION } from "@Redux/Constants/index";

let usuario = undefined;
let savedState = localStorage.getItem("store");
if (savedState && savedState != "undefined") {
  usuario = JSON.parse(savedState).Usuario.usuario;
}
const initialState = {
  usuario: usuario
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USUARIO_LOGIN: {
      return { ...state, usuario: action.payload };
    }
    case USUARIO_CERRAR_SESION: {
      return { ...state, usuario: undefined };
    }
    default:
      return state;
  }
};
export default reducer;
