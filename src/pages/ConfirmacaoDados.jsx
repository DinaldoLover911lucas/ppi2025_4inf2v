import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router"; 
import styles from "./ConfirmacaoDados.module.css"; 

export function ConfirmacaoDados() {
  const [tipoServico, setTipoServico] = useState(null);
  const [erro, setErro] = useState(null);
  const [valores, setValores] = useState({});
  const navigate = useNavigate();

  const configuracaoCampos = {
    entrega: [
      { nome: "Endereço de Entrega", chave: "endereco", tipo: "text" },
      { nome: "Telefone", chave: "tel", tipo: "tel" },
      { nome: "Ponto de Referência", chave: "referencia", tipo: "text" }
    ],
    restaurante: [
      { nome: "Número da Mesa", chave: "mesa", tipo: "number" },
      { nome: "Nome do Cliente", chave: "cliente", tipo: "text" },
      { nome: "Observação (Opcional)", chave: "obs", tipo: "text" }
    ],
    agendamento: [
      { nome: "Data do Serviço", chave: "data", tipo: "date" },
      { nome: "Horário", chave: "hora", tipo: "time" },
      { nome: "Nome do Profissional", chave: "profissional", tipo: "text" }
    ]
  };

  useEffect(() => {
    async function carregarConfiguracao() {
      try {
        const { data, error } = await supabase
          .from("configuracao_servico")
          .select("tipo")
          .eq("ativo", true)
          .order("criado_em", { ascending: false })
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          // .trim() remove espaços e .toLowerCase() garante a comparação correta
          setTipoServico(data[0].tipo.trim().toLowerCase());
        } else {
          setErro("Nenhuma configuração ativa encontrada no Admin.");
        }
      } catch (err) {
        setErro("Erro ao carregar configurações: " + err.message);
      }
    }
    carregarConfiguracao();
  }, []);

  function handleChange(chave, valor) {
    setValores({ ...valores, [chave]: valor });
  }

  function handleConfirmar(e) {
    e.preventDefault();
    localStorage.setItem("dados_confirmacao", JSON.stringify(valores));
    navigate("/confirmacao");
  }

  if (erro) return <div style={{ marginTop: "160px", color: "red", textAlign: "center" }}>{erro}</div>;
  if (!tipoServico) return <div style={{ marginTop: "160px", color: "white", textAlign: "center" }}>Carregando formulário...</div>;

  const camposParaExibir = configuracaoCampos[tipoServico] || [];

  return (
    <div style={{ marginTop: "140px", padding: "20px", maxWidth: "450px", marginInline: "auto", background: "#1e1e1e", borderRadius: "12px", color: "white", boxShadow: "0 4px 15px rgba(0,0,0,0.3)", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Confirmar Dados</h2>
      <p style={{ textAlign: "center", color: "#aaa", marginBottom: "20px" }}>
        Tipo de pedido: <strong>{tipoServico.toUpperCase()}</strong>
      </p>

      <form onSubmit={handleConfirmar}>
        {camposParaExibir.map((campo) => (
          <div key={campo.chave} style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>{campo.nome}</label>
            <input
              type={campo.tipo}
              required
              placeholder={`Digite aqui...`}
              onChange={(e) => handleChange(campo.chave, e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #333", background: "#2d2d2d", color: "white", boxSizing: "border-box" }}
            />
          </div>
        ))}
        <button type="submit" style={{ width: "100%", padding: "14px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "10px" }}>
          Finalizar e Confirmar
        </button>
      </form>
    </div>
  );
}