// src/controllers/webhookController.ts
import Message from '../models/Message';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import WhatsappService from '../services/whatsappService';

dotenv.config();

class WebhookController {
    static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('Corpo da requisição:', req.body); // Adicione esse log

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
                const parsedBody = req.body;

                // Verificar se o corpo da requisição contém mensagens
                if (!parsedBody || !parsedBody.entry || !parsedBody.entry[0].changes[0].value.messages) {
                    console.log('Nenhuma mensagem recebida ou não é uma mensagem');
                    res.status(200).send('Nenhuma mensagem recebida');
                    return;
                }

                const changeData = parsedBody.entry[0].changes[0].value;

                // Verificar se a mudança foi sobre uma mensagem
                if (!changeData.messages) {
                    console.log('Alteração não relacionada a mensagens, ignorando...');
                    res.status(200).send('Alteração não relacionada a mensagens');
                    return;
                }

                const messageData = changeData.messages[0];

                // Verifica se a mensagem é válida e contém texto
                if (!messageData || !messageData.text || !messageData.text.body) {
                    console.log('Mensagem vazia ou inválida, ignorando...');
                    res.status(200).send('Mensagem vazia ou inválida, ignorando...');
                    return;
                }

                // Processar a mensagem recebida
                const message = new Message(parsedBody);
                console.log(`Mensagem recebida de ${message.name}: ${message.body}`);

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
            }
            else {
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