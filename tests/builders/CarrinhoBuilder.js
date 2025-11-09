import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { UserMother } from './UserMother.js';

export class CarrinhoBuilder {
    constructor() {
        // Valores padrão
        this._user = UserMother.umUsuarioPadrao();
        this._itens = [new Item('Item Padrão', 10.0)];
    }

    // Método para definir usuário
    comUser(user) {
        this._user = user;
        return this;
    }

    // Método para definir itens
    comItens(itens) {
        this._itens = itens;
        return this;
    }

    // Método para criar carrinho vazio
    vazio() {
        this._itens = [];
        return this;
    }

    // Método para adicionar um item
    adicionarItem(item) {
        this._itens.push(item);
        return this;
    }

    // Método final que constrói o Carrinho
    build() {
        return new Carrinho(this._user, this._itens);
    }

    // Método estático de conveniência para criar um carrinho padrão
    static umCarrinhoPadrao() {
        return new CarrinhoBuilder().build();
    }
}
