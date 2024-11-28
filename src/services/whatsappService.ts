// src/services/whatsappService.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class WhatsappService {
    static async sendMessage(to: string, message: string): Promise<void> {
        const token = process.env.ACCESS_TOKEN;
        const phoneNumberId = process.env.PHONE_NUMBER_ID;

        if (!token || !phoneNumberId) {
            throw new Error('Credenciais do WhatsApp não configuradas.');
        }

        const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
                body: message,
            },
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            const response = await axios.post(url, payload, { headers });
            console.log('Resposta da API do WhatsApp:', response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Erro ao enviar mensagem via WhatsApp:', error.response?.data || error.message);
            } else {
                console.error('Erro ao enviar mensagem via WhatsApp:', (error as Error).message);
            }
            throw error;
        }
    }
}

export default WhatsappService;
