// src/models/User.ts
class User {
    id: string
    name: string
    phone: string
    constructor(id: string, name: string, phone: string) {
        this.id = id;
        this.name = name;
        this.phone = phone;
    }

    formatPhone() {
        return this.phone.replace(/\D/g, ''); // Remove caracteres não numéricos
    }
}

export default User