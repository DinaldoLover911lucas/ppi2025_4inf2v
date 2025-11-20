import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSession } from "../contexts/SessionContext";

export default function AdminProducts() {
  const { profile } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, description: "", image_url: "" });

  useEffect(() => {
    if (!profile || !profile.is_admin) return;
    const load = async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) console.error(error);
      else setProducts(data || []);
    };
    load();
  }, [profile]);

  if (!profile) return <div>Carregando...</div>;
  if (!profile.is_admin) return <div>Acesso negado</div>;

  const createProduct = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("products").insert([form]).select();
    if (error) return alert("Erro: " + error.message);
    setProducts(prev => [data[0], ...prev]);
    setForm({ name: "", price: 0, description: "", image_url: "" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Remover produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return alert("Erro: " + error.message);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = async (id, updates) => {
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select();
    if (error) return alert("Erro: " + error.message);
    setProducts(prev => prev.map(p => (p.id === id ? data[0] : p)));
  };

  return (
    <div>
      <h1>Painel Admin - Produtos</h1>
      <form onSubmit={createProduct}>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
        <input placeholder="Preço" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required/>
        <input placeholder="Imagem URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})}/>
        <textarea placeholder="Descrição" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
        <button type="submit">Criar</button>
      </form>

      <hr />

      {products.map(p => (
        <div key={p.id}>
          <strong>{p.name}</strong> - R${p.price}
          <button onClick={() => deleteProduct(p.id)}>Remover</button>
          <button onClick={() => {
            const newPrice = prompt("Novo preço", p.price);
            if (newPrice !== null) updateProduct(p.id, { price: Number(newPrice) });
          }}>Editar preço</button>
        </div>
      ))}
    </div>
  );
}
