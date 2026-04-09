const request = require('supertest');
const { expect } = require('chai');

describe('Transferências', () => {
    describe('POST/transferencias', () => {
        it('Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de 10,00', async () => {
            //capturar o token do login
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    'username': 'julio.lima',
                    'senha': '123456'
                });

            const token = respostaLogin.body.token;

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 11.00,
                    token: ""
                });
            expect(resposta.status).to.equal(201);
        });

        it('Deve retornar erro com 422 quando o valor da transferência for abaixo ou igual a 10,00', async () => {
            //capturar o token do login
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    'username': 'julio.lima',
                    'senha': '123456'
                });

            const token = respostaLogin.body.token;

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 9.99,
                    token: ""
                });
            expect(resposta.status).to.equal(422);
        });

    });
});