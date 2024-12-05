// src/services/difyService.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class DifyService {
    static async generateResponse(prompt: string): Promise<string> {
        const apiKey = process.env.DIFY_API_KEY; // Sua chave da API do Dify
        const url = process.env.DIFY_API_URL; // URL da API do Dify

        if (!apiKey || !url) {
            throw new Error('Credenciais do Dify não estão configuradas.');
        }

        try {
            const response = await axios.post(
                url,
                { prompt }, // Corpo da requisição
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            return response.data.text; // Supondo que a resposta seja do tipo { text: "..." }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro ao conectar ao Dify:', error.response?.data || error.message);
                throw new Error('Erro na integração com o Dify.');
            }
            throw error;
        }
    }
}

export default DifyService;
