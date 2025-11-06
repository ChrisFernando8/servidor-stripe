import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

// Rota inicial para teste
app.get("/", (req, res) => {
  res.send("Servidor Stripe funcionando ✅");
});

// Rota para criar checkout
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Compra Premium 💎",
              description: "Acesso completo por apenas R$10,00",
            },
            unit_amount: 1000, // R$10,00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://stripe.onrender.com/sucesso",
      cancel_url: "https://stripe.onrender.com/cancelado",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento" });
  }
});

// Páginas de sucesso e cancelamento
app.get("/sucesso", (req, res) => {
  res.send("✅ Pagamento realizado com sucesso!");
});

app.get("/cancelado", (req, res) => {
  res.send("❌ Pagamento cancelado!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
