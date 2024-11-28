// src/models/Message.ts
    // Constructor que recebe o corpo da requisição
        // Extraindo as informações relevantes do JSON
interface WebhookChange {
    value: WebhookChangeValue;
    changes: WebhookChangeDetail[];
}

interface WebhookChangeDetail {
    value?: WebhookValue;
}

interface WebhookChangeValue {
    messages?: WebhookMessage[];
    contacts?: WebhookContact[];
}

interface WebhookValue {
    messages?: WebhookMessage[];
    contacts?: WebhookContact[];
}

interface WebhookMessage {
    from: string;
    text: {
        body: string;
    };

}

interface WebhookContact {
    profile: {
        name: string;
    };
}

class Message {
    from: string;
    body: string;
    name: string;

    // Constructor que recebe o corpo da requisição
    constructor(json: { entry?: WebhookChange[] }) {
        // Extraindo as informações relevantes do JSON
        const message = json.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        const contact = json.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];
        
        // Definindo as propriedades
        this.from = message?.from || '';
        this.body = message?.text?.body || '';
        this.name = contact?.profile?.name || 'Desconhecido';
    }

    // Método para validar a mensagem
    isValid(): boolean {
        return this.body.length > 0 && this.from.length > 0;
    }
}

export default Message;
