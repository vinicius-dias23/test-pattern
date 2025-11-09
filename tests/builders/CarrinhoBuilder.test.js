import { CarrinhoBuilder } from './CarrinhoBuilder.js';
import { Item } from '../../src/domain/Item.js';
import { UserMother } from './UserMother.js';

describe('CarrinhoBuilder', () => {
    it('deve criar um carrinho com valores padrão', () => {
        const carrinho = CarrinhoBuilder.umCarrinhoPadrao();
        
        expect(carrinho.user).toEqual(UserMother.umUsuarioPadrao());
        expect(carrinho.itens).toHaveLength(1);
        expect(carrinho.itens[0].nome).toBe('Item Padrão');
        expect(carrinho.itens[0].preco).toBe(10.0);
    });

    it('deve permitir customizar o carrinho', () => {
        const userPremium = UserMother.umUsuarioPremium();
        const itens = [
            new Item('Item 1', 100),
            new Item('Item 2', 200)
        ];

        const carrinho = new CarrinhoBuilder()
            .comUser(userPremium)
            .comItens(itens)
            .build();

        expect(carrinho.user).toBe(userPremium);
        expect(carrinho.itens).toEqual(itens);
    });

    it('deve criar um carrinho vazio', () => {
        const carrinho = new CarrinhoBuilder()
            .vazio()
            .build();

        expect(carrinho.itens).toHaveLength(0);
    });

    it('deve permitir adicionar itens incrementalmente', () => {
        const item1 = new Item('Item 1', 100);
        const item2 = new Item('Item 2', 200);

        const carrinho = new CarrinhoBuilder()
            .vazio()
            .adicionarItem(item1)
            .adicionarItem(item2)
            .build();

        expect(carrinho.itens).toHaveLength(2);
        expect(carrinho.itens).toContain(item1);
        expect(carrinho.itens).toContain(item2);
    });
});