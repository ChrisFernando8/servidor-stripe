// server.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(express.static("public"));

// ✅ Rota principal para verificar se o servidor está online
app.get("/", (req, res) => {
  res.send("Servidor Stripe funcionando ✅");
});

// ✅ Rota para criar sessão de pagamento no Stripe
app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Checkout de Teste",
            },
            unit_amount: 1000, // R$10,00 (em centavos)
          },
          quantity: 1,
        },
      ],
      success_url: "https://stripe.onrender.com/sucesso",
      cancel_url: "https://stripe.onrender.com/cancelado",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Páginas de retorno após pagamento
app.get("/sucesso", (req, res) => {
  res.send("✅ Pagamento concluído com sucesso!");
});

app.get("/cancelado", (req, res) => {
  res.send("❌ Pagamento cancelado!");
});

// ✅ Porta do servidor (Render define automaticamente ou usa 10000)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor Stripe rodando na porta ${PORT}`));
