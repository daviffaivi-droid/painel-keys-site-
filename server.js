const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Armazena as keys em memória enquanto o servidor estiver rodando
const keysMap = new Map();

app.get("/api/keys", (req, res) => {
  res.json(Array.from(keysMap.values()));
});

app.post("/api/keys", (req, res) => {
  const lista = Array.isArray(req.body) ? req.body : [];
  keysMap.clear();
  for (const item of lista) {
    if (item && item.key) {
      keysMap.set(item.key, { ...item });
    }
  }
  res.json({ ok: true, total: keysMap.size });
});

app.post("/api/log-key", (req, res) => {
  const { key, usuario, validade, expiraEm } = req.body || {};
  if (!key) {
    return res.status(400).json({ erro: "Key obrigatoria" });
  }

  const anterior = keysMap.get(key) || {};
  const atualizado = {
    ...anterior,
    key,
    usuario: usuario || anterior.usuario || "Desconhecido",
    validade: validade || anterior.validade || "Permanente",
    expiraEm: expiraEm !== undefined ? expiraEm : (anterior.expiraEm || null),
    usada: true,
    ativa: true,
    ativadaEm: new Date().toISOString()
  };

  keysMap.set(key, atualizado);
  res.json({ ok: true, data: atualizado });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API rodando na porta " + PORT);
});
