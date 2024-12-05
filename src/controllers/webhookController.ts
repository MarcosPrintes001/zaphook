// src/controllers/webhookController.ts
import Message from '../models/Message';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import WhatsappService from '../services/whatsappService';
import DifyService from '../services/difyService';
import User from '../models/User';

dotenv.config();

class WebhookController {
    static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.method === 'GET') {
                // Validação do Webhook do WhatsApp
                const mode = req.query['hub.mode'];
                const token = req.query['hub.verify_token'];
                const challenge = req.query['hub.challenge'];

                if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
                    res.status(200).send(challenge);  // Responde com o desafio
                } else {
                    res.status(403).send('Falha na validação do webhook.');
                }
            } else if (req.method === 'POST') {
                const parsedBody = req.body;
                const message = new Message(parsedBody);

                // Verificar se a mensagem está vazia
                if (!message.body || message.body.trim() === '') {
                    res.status(400).send('Mensagem vazia. Nenhuma ação realizada.');
                    return;
                }

                // Encontrar ou criar usuário
                let user = User.findUser(message.wa_id);
                if (!user) {
                    user = User.addUser(message.wa_id, message.name, message.from);  // Adiciona usuário caso não exista
                }

                // Chama o Dify para processar a resposta da mensagem
                const difyResponse = await DifyService.handleChat(message.body, message.from);

                // Envia a resposta do Dify para o WhatsApp
                if (difyResponse) {
                    await WhatsappService.sendMessage(message.from, difyResponse);
                } else {
                    // Caso não haja resposta, envia uma mensagem padrão
                    await WhatsappService.sendMessage(message.from, 'Desculpe, não entendi a sua mensagem.');
                }

                res.status(200).send('Mensagem recebida e resposta enviada com sucesso!');
            } else {
                res.status(405).send('Método não permitido');  // Caso o método não seja GET ou POST
            }
        } catch (error) {
            console.error('Erro no WebhookController:', error);
            next(error);
        }
    }
}

export default WebhookController;
