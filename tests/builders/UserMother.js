import { User } from '../../src/domain/User.js';

export class UserMother {
    static umUsuarioPadrao() {
        // id, nome, email, tipo
        return new User('user-1', 'João Silva', 'joao.silva@example.com', 'PADRAO');
    }

    static umUsuarioPremium() {
        return new User('user-2', 'Maria Oliveira', 'maria.oliveira@example.com', 'PREMIUM');
    }
}
