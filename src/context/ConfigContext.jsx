import { createContext, useContext, useState } from "react";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [tipoServico, setTipoServico] = useState("entrega"); // padrão

  return (
    <ConfigContext.Provider value={{ tipoServico, setTipoServico }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
