// src/controllers/webhookController.ts
import Message from '../models/Message';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import WhatsappService from '../services/whatsappService';

dotenv.config();

class WebhookController {
    static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Verifica o método da requisição
            if (req.method === 'GET') {
                const mode = req.query['hub.mode'];
                const token = req.query['hub.verify_token'];
                const challenge = req.query['hub.challenge'];

                if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
                    console.log('Webhook validado com sucesso!');
                    res.status(200).send(challenge); // Retorna o desafio para o Facebook
                } else {
                    console.error('Falha na validação do webhook.');
                    res.status(403).send('Falha na validação do webhook.');
                }
            } else if (req.method === 'POST') {
                // Processa a requisição recebida
                const parsedBody = req.body;
                
                // Cria uma nova instância da classe Message com o JSON recebido
                const message = new Message(parsedBody);

                // Verifica a validade da mensagem
                // if (!message.isValid()) {
                //     res.status(400).json({ error: 'Dados da mensagem inválidos' });
                //     return;
                // }

                // Exibe o nome do remetente e o conteúdo da mensagem
                console.log(`Mensagem recebida de ${message.name}: ${message.body}`);

                //Lógica de envio de resposta
                const responseMessage = `Olá, ${message.name}! Recebi sua mensagem: "${message.body}".`;

                try {
                    await WhatsappService.sendMessage(message.from, responseMessage);
                    console.log('Mensagem enviada com sucesso!');
                } catch (sendError) {
                    console.error('Erro ao enviar mensagem:', sendError);
                    res.status(500).json({ error: 'Erro ao enviar a mensagem de resposta.' });
                    return;
                }

                res.status(200).send('Mensagem recebida e resposta enviada com sucesso!');
            } else {
                // Responde com 405 para outros métodos
                res.status(405).send('Método não permitido');
            }
        } catch (error) {
            console.error('Erro no WebhookController:', error);
            next(error);
        }
    }
}

export default WebhookController;