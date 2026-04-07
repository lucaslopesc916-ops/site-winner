export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Webhook ativo!");
  }

  const WPP_API_URL  = "https://smv2-8.stevo.chat";
  const WPP_API_KEY  = "1769036519293fRvOnazfAzj4wi2q";
  const LINK_GRUPO   = "https://chat.whatsapp.com/COO82ANNOApAIsS19EZ5BE";

  try {
    const payload = req.body;
    const order = payload?.order || payload;
    const status = order.order_status || payload.order_status;

    console.log("Evento recebido:", status);

    if (status !== "paid") {
      return res.status(200).send("Ignorado");
    }

    const nome = order.Customer?.full_name || "";
    const telefone = order.Customer?.mobile || "";

    if (!telefone) {
      console.log("Sem telefone no payload");
      return res.status(200).send("Sem telefone");
    }

    const primeiro = nome ? nome.split(" ")[0] : "amigo(a)";
    const mensagem = `Fala, ${primeiro}! 👋

Seja muito bem-vindo(a) ao workshop!

Lembrando: será dia 13/04 às 19h

Esse workshop ficará gravado, mas é super importante que você participe online, que é sua oportunidade de tirar suas dúvidas 100% comigo

O acesso ao grupo é por esse link

É só entrar lá 👇
${LINK_GRUPO}`;

    const numero = telefone.replace(/\D/g, "");

    const response = await fetch(
      `${WPP_API_URL}/send/text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: WPP_API_KEY,
        },
        body: JSON.stringify({
          number: numero,
          text: mensagem,
          delay: 1500,
          linkPreview: false,
        }),
      }
    );

    const data = await response.text();
    console.log(`WPP [${response.status}]: ${data}`);

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Erro:", err.message);
    return res.status(200).send("Erro");
  }
}
