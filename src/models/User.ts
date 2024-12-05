// src/models/User.ts

interface IUserData {
    cpf?: string;
    car?: string;
    // Outros campos conforme necessário
}

class User {
    id: string;
    name: string;
    state: string;
    data: IUserData;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.state = 'default'; // Estado inicial padrão
        this.data = {};
    }

    // Simulação de banco de dados em memória
    private static usersDatabase: User[] = [];

    // Encontrar usuário pelo ID
    static findUser(userId: string): User | undefined {
        return this.usersDatabase.find(u => u.id === userId);
    }

    // Adicionar novo usuário
    static addUser(userId: string, userName: string): User {
        const newUser = new User(userId, userName);
        this.usersDatabase.push(newUser);
        console.log(`Novo usuário adicionado: ${userId} - ${userName}`);
        return newUser;
    }

    // Obter o estado atual do usuário
    static getUserState(userId: string): string {
        const user = this.findUser(userId);
        return user ? user.state : 'default';
    }

    // Atualizar o estado do usuário
    static updateUserState(userId: string, state: string, value?: string): void {
        let user = this.findUser(userId);
        if (user) {
            console.log(`Atualizando estado do usuário ${userId} para ${state} com valor ${value}`);
            if (state === 'cpf') {
                user.data.cpf = value!;
                user.state = 'awaiting_car';
            } else if (state === 'car') {
                user.data.car = value!;
                user.state = 'car'; // Mantém estado até finalizar as validações
            } else if (state === 'handoff') {
                user.state = 'handoff';
            } else {
                user.state = state;
            }
            console.log(`Estado atualizado para ${user.state}`);
        } else {
            console.log(`Usuário ${userId} não encontrado. Criando novo usuário.`);
            user = new User(userId, 'Nome do Usuário');
            if (state === 'cpf') {
                user.data.cpf = value!;
                user.state = 'awaiting_car';
            } else if (state === 'car') {
                user.data.car = value!;
                user.state = 'car';
            } else if (state === 'handoff') {
                user.state = 'handoff';
            } else {
                user.state = state;
            }
            this.usersDatabase.push(user);
            console.log(`Novo usuário criado com estado ${user.state}`);
        }
    }

    // Finalizar o fluxo do usuário
    static finalizeUser(userId: string): void {
        const user = this.findUser(userId);
        if (user) {
            user.state = 'handoff';
            console.log(`Fluxo do usuário ${userId} finalizado para 'handoff'.`);
        } else {
            console.log(`Usuário ${userId} não encontrado para finalização.`);
        }
    }
}

export default User;