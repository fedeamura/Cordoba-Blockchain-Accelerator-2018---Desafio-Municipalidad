import { USUARIO_LOGIN, USUARIO_CERRAR_SESION } from "@Redux/Constants/index";

const initialState = {
  usuario: undefined
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
