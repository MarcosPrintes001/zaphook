// src/models/User.ts
class User {
    id: string;
    name: string;
    phone: string;

    // Armazenando os usuários em um array estático
    private static users: User[] = [];

    constructor(id: string, name: string, phone: string) {
        this.id = id;
        this.name = name;
        this.phone = phone;
    }

    private static usersDatabase: User[] = [];

    // Método para formatar o telefone
    formatPhone() {
        return this.phone.replace(/\D/g, ''); // Remove caracteres não numéricos
    }

    // buscar um usuário pelo ID
    static findUser(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    // adicionar um novo usuário
    static addUser(id: string, name: string, phone: string): User {
        const newUser = new User(id, name, phone);
        this.users.push(newUser);
        return newUser;
    }
}

export default User;
