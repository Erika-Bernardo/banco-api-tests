const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao');
const postTransferencias = require('../fixtures/postTransferencias.json');

describe('Transferências', () => {
    describe('POST/transferencias', () => {
        let token;

        beforeEach(async () => {
            token = await obterToken('julio.lima', '123456');
        });


        it('Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de 10,00', async () => {
            const bodyTransferencia = { ...postTransferencias };

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencia);
            expect(resposta.status).to.equal(201);
        });

        it('Deve retornar erro com 422 quando o valor da transferência for abaixo ou igual a 10,00', async () => {
            const bodyTransferencia = { ...postTransferencias };
            bodyTransferencia.valor = 9.99;

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencia);
            expect(resposta.status).to.equal(422);
        });

    });
});