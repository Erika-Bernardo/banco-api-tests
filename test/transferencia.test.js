const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao');
const postTransferencias = require('../fixtures/postTransferencias.json');

describe('Transferências', () => {
    let token;

    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456');
    });

    describe('POST/transferencias', () => {

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

    describe('GET/transferencias/{id}', () => {

        it('Deve retornar sucesso com 200 e dados iguais ao registro de tranferência contido no banco de dados quando o id for válido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias/13')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.id).to.equal(13);
            expect(resposta.body.id).to.be.a('number');
            expect(resposta.body.valor).to.equal(11.00); // no swagger descrimina que é umnumer float, mas no banco de dados é string, necessario corrigir esse bug.
            expect(resposta.body.conta_oriegm_id).to.equal(1)
            expect(resposta.body.conta_destino_id).to.equal(2);
        });
    });

    describe('GET/transferencias', () => {

        it('Deve retornar 10 elementos na paginação quando informar limite de 10 registros', async () => {
            
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limite=10')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.limit).to.equal(10);
            expect(resposta.body.transferencias).to.have.lengthOf(10);
        });
    });
});