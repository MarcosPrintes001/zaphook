// src/services/difyService.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class DifyService {
    private static apiKey = process.env.DIFY_API_KEY;
    private static apiUrl = process.env.DIFY_API_URL;

    // Método para enviar consulta ao Dify e retornar a resposta
    static async sendQuery(query: string, userId: string): Promise<string> {
        if (!query || query.trim() === '') {
            return 'Mensagem vazia. Tente novamente.';
        }

        const headers = {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };

        const payload = {
            query: query,
            response_mode: 'streaming',  // Se necessário, altere para 'blocking' se não usar streaming
            user: { id: userId },
            conversation_id: '',  // Se necessário, ajuste conforme o modelo de conversa
        };

        try {
            const response = await axios.post(`${this.apiUrl}/chat-messages`, payload, { headers });
            const message = response.data.answer;

            // Se a resposta do Dify for válida, retorna a mensagem
            return message || 'Desculpe, não entendi sua solicitação.';
        } catch (error) {
            console.error('Erro ao comunicar com o Dify:', error);
            return 'Erro ao processar sua solicitação. Tente novamente mais tarde.';
        }
    }

    // Método para gerenciar a resposta do Dify e enviar ao WhatsApp
    static async handleChat(query: string, userId: string): Promise<string> {
        const response = await DifyService.sendQuery(query, userId);

        return response;
    }
}

export default DifyService;
