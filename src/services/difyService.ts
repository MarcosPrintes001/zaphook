import axios from 'axios';
import User from '../models/User';
import WhatsappService from './whatsappService';

class DifyService {
    private static apiKey = process.env.DIFY_API_KEY;
    private static apiUrl = process.env.DIFY_API_URL;
    private static conversationIds: { [key: string]: string } = {};

    static async sendQuery(query: string, user: User): Promise<string> {
        if (!query || query.trim() === '') {
            return 'Query vazia. Nenhuma ação realizada.';
        }

        const headers = {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };

        const conversationId = this.conversationIds[user.id] || '';

        const payload = {
            query: query,
            inputs: {},
            response_mode: "blocking",
            user: {
                id: user.id,
                name: user.name,
            },
            conversation_id: conversationId,
        };

        try {
            const response = await axios.post(`${this.apiUrl}/chat-messages`, payload, { headers });
            const message = response.data.answer;

            if (response.data.conversation_id && typeof response.data.conversation_id === 'string') {
                this.conversationIds[user.id] = response.data.conversation_id;
            }

            return message;
        } catch (error) {
            console.error('Erro ao comunicar com o Dify:', error);
            return 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.';
        }
    }

}

export default DifyService;
