import { useState } from "react";
import { supabase } from "../utils/supabase";

export function AdminConfiguracao() {
  const [tipo, setTipo] = useState("entrega");
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    setCarregando(true);
    console.log("Iniciando atualização de configuração:", tipo);

    try {
      // 1. Desativa todos os que estão como 'TRUE' atualmente
      // Isso garante que apenas um serviço fique ativo por vez
      const { error: updateError } = await supabase
        .from("configuracao_servico")
        .update({ ativo: false })
        .eq("ativo", true);

      if (updateError) throw updateError;

      // 2. Insere a nova configuração escolhida
      const { error: insertError } = await supabase
        .from("configuracao_servico")
        .insert({
          tipo,
          ativo: true,
        });

      if (insertError) throw insertError;

      alert("Configuração atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar configuração: " + error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "140px auto 60px",
        padding: 20,
        border: "1px solid #444",
        borderRadius: 8,
        background: "#222", // Ajustado para combinar com seu tema escuro
        color: "white",
        textAlign: "center"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Configuração do Sistema</h2>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Tipo de serviço ativo:</label>
        <select 
          value={tipo} 
          onChange={(e) => setTipo(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", background: "#333", color: "white" }}
        >
          <option value="entrega">Entrega (Delivery)</option>
          <option value="restaurante">Restaurante (Mesa)</option>
          <option value="agendamento">Agendamento (Serviços)</option>
        </select>
      </div>

      <button 
        type="button" 
        onClick={salvar}
        disabled={carregando}
        style={{
          padding: "10px 30px",
          backgroundColor: carregando ? "#555" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: carregando ? "not-allowed" : "pointer",
          fontWeight: "bold"
        }}
      >
        {carregando ? "Salvando..." : "Salvar Configuração"}
      </button>

      <p style={{ fontSize: "12px", marginTop: "15px", color: "#aaa" }}>
        * Isso mudará os campos solicitados ao cliente na hora da compra.
      </p>
    </div>
  );
}