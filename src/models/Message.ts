// src/models/Message.ts
interface WebhookContact {
    wa_id: string;
    profile: {
        name: string;
    };
}

interface WebhookMessage {
    from: string;
    text: {
        body: string;
    };
}

class Message {
    from: string;
    body: string;
    name: string;
    wa_id: string;

    constructor(json: { entry?: any[] }) {
        const message = json.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        const contact = json.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

        this.from = message?.from || '';
        this.body = message?.text?.body || '';
        this.name = contact?.profile?.name || 'Desconhecido';
        this.wa_id = contact?.wa_id || ''; // wa_id extraído corretamente
    }

    isValid(): boolean {
        return this.body.length > 0 && this.from.length > 0;
    }
}

export default Message;
