import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { Item } from '../src/domain/Item.js';
import { UserMother } from './builders/UserMother.js';
import { CheckoutService } from '../src/services/CheckoutService.js';

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

describe('CheckoutService', () => {
    describe('quando o pagamento falha', () => {
        it('deve retornar null quando gateway retorna falha', async () => {
            // Arrange
            const carrinho = CarrinhoBuilder.umCarrinhoPadrao();
            const cartaoCredito = "1234-5678-9012-3456";

            // Test Doubles (Stubs e Dummies)
            const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: false }) };
            const repositoryDummy = { salvar: jest.fn() };
            const emailServiceDummy = { enviarEmail: jest.fn() };

            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryDummy,
                emailServiceDummy
            );

            // Act
            const pedido = await checkoutService.processarPedido(carrinho, cartaoCredito);

            // Assert
            expect(pedido).toBeNull();
        });
    });

    describe('quando um cliente Premium finaliza a compra', () => {
        it('deve aplicar desconto e enviar email de confirmação', async () => {
            // Arrange
            const userPremium = UserMother.umUsuarioPremium();
            const cartaoCredito = "1234-5678-9012-3456";

            const carrinho = new CarrinhoBuilder()
                .comUser(userPremium)
                .comItens([
                    new Item('Item 1', 120),
                    new Item('Item 2', 80)
                ])
                .build();

            // Test Doubles
            const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
            const pedidoSalvo = { id: 'pedido-1', carrinho, totalFinal: 180, status: 'PROCESSADO' };
            const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
            const emailMock = { enviarEmail: jest.fn().mockResolvedValue(undefined) };

            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryStub,
                emailMock
            );

            // Act
            await checkoutService.processarPedido(carrinho, cartaoCredito);

            // Assert - Verificação de Comportamento
            expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito);
            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
            expect(emailMock.enviarEmail).toHaveBeenCalledWith(
                userPremium.email,
                'Seu Pedido foi Aprovado!',
                `Pedido pedido-1 no valor de R$180`
            );
        });
    });
});
