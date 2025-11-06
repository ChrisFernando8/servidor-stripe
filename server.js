import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Rota principal para teste
app.get("/", (req, res) => {
  res.send("Servidor Stripe funcionando ✅");
});

// Criar checkout
app.post("/checkout", async (req, res) => {
  const { name, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name },
            unit_amount: amount * 100, // em centavos
          },
          quantity: 1,
        },
      ],
      success_url: "https://stripe.onrender.com/success",
      cancel_url: "https://stripe.onrender.com/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento" });
  }
});

// Página de sucesso
app.get("/success", (req, res) => {
  res.send(`
    <body style="font-family: Arial; background:#111; color:#0f0; text-align:center; padding:50px;">
      <h1>✅ Pagamento realizado com sucesso!</h1>
      <p>Obrigado por apoiar nosso conteúdo 🙏</p>
      <button onclick="window.location.href='geyser://app'">Voltar ao app</button>
    </body>
  `);
});

// Página de cancelamento
app.get("/cancel", (req, res) => {
  res.send(`
    <body style="font-family: Arial; background:#111; color:#f00; text-align:center; padding:50px;">
      <h1>❌ Pagamento cancelado</h1>
      <p>Você pode tentar novamente quando quiser.</p>
      <button onclick="window.location.href='geyser://app'">Voltar ao app</button>
    </body>
  `);
});

app.listen(10000, () => console.log("Servidor Stripe rodando na porta 10000"));
