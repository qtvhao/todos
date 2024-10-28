// // test/app.e2e-spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { io, Socket } from 'socket.io-client';
// import axios from 'axios';

// // npx jest   test/app.e2e-spec.ts
// describe('Todo App (e2e)', () => {
//   let app: INestApplication;
//   let clientSocket: Socket;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   it('should create a todo, assign permission, complete it, and receive a notification', async (done) => {
//     const BASE_URL = '';
//     await axios.post(BASE_URL + '/users/create', { user_id: 'user123', name: 'John Doe', email: 'johndoe@example.com', attributes: { department: 'engineering', role: 'developer' } });

    
//     let createAccessKey = await axios.post(BASE_URL + '/access-keys/create', { user_id: 'user123', description: 'My new access key' });
//     let {
//       access_key: { access_key_id: accessKeyId, secret_access_key: secretAccessKey },
//     } = createAccessKey.data;
//     // console.log(access_key_id, secret_access_key);

//     // Step 1: Create a new Todo
//     const createResponse = await request(app.getHttpServer())
//       .post('/todos')
//       .send({
//         accessKeyId,
//         secretAccessKey,
//         title: 'Test Todo',
//         description: 'This is a test todo',
//       })
//       .expect(201);

//     const todo = createResponse.body;
//     expect(todo).toHaveProperty('id');
//     expect(todo).toHaveProperty('title', 'Test Todo');
//     expect(todo).toHaveProperty('description', 'This is a test todo');
//     expect(todo).toHaveProperty('completed', false);
//     throw new Error('Test Error');

//     // Step 2: Connect WebSocket client and listen for notifications
//     clientSocket = io('http://localhost:3000/notifications', {
//       query: {
//         accessKeyId,
//         secretAccessKey,
//       },
//       transports: ['websocket'],
//     });

//     clientSocket.on('connect', () => {
//       console.log('WebSocket client connected');
//     });

//     clientSocket.on('notification', (message: string) => {
//       expect(message).toBe(`Your todo "${todo.title}" is completed!`);
//       done();
//     });

//     // Step 3: Complete the Todo
//     await request(app.getHttpServer())
//       .put(`/todos/${todo.id}/complete`)
//       .send({
//         accessKeyId,
//         secretAccessKey,
//       })
//       .expect(200);
//   }, 60_000);

//   afterEach(() => {
//     if (clientSocket) {
//       clientSocket.disconnect();
//     }
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
