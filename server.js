import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// 🔑 Inicializa Stripe com sua chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🔹 Rota principal só pra teste
app.get("/", (req, res) => {
  res.send("Servidor Stripe funcionando ✅");
});

// 🔹 Rota de checkout
app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Checkout Express",
            },
            unit_amount: 1000, // 💰 10 reais
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://stripe.onrender.com/sucesso",
      cancel_url: "https://stripe.onrender.com/cancelado",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Rotas de retorno
app.get("/sucesso", (req, res) => res.send("✅ Pagamento realizado com sucesso!"));
app.get("/cancelado", (req, res) => res.send("❌ Pagamento cancelado."));

app.listen(10000, () => console.log("Servidor Stripe rodando na porta 10000"));
