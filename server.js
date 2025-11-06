import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe("sk_test_1234567890abcdef"); // coloque sua chave secreta do Stripe aqui

app.use(cors());
app.use(express.json());

app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Acesso Premium - A Vinda do Reino",
            },
            unit_amount: 1000, // 10 reais em centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://geysersite.com/sucesso", // mude se quiser
      cancel_url: "https://geysersite.com/cancelado",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento" });
  }
});

app.listen(10000, () => console.log("Servidor Stripe rodando na porta 10000"));
