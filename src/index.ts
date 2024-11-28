// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import WebhookController from './controllers/webhookController';
// import WhatsappService from './services/whatsappService';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rota para o webhook
app.post('/webhook', WebhookController.handleWebhook);
app.get('/webhook', WebhookController.handleWebhook);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// WhatsappService.sendMessage('559391858201', 'Olá, tudo bem?');