// // test/app.e2e-spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

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
  let clientSocket: Socket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);
  });

  it('should create a todo, assign permission, complete it, and receive a notification', async () => {
    await axios.post(BASE_URL + '/users/create', { user_id: 'user123', name: 'John Doe', email: 'johndoe@example.com', attributes: { department: 'engineering', role: 'developer' } });
    let createAccessKey = await axios.post(BASE_URL + '/access-keys/create', { user_id: 'user123', description: 'My new access key' });
    let {
      access_key: { access_key_id: accessKeyId, secret_access_key: secretAccessKey },
    } = createAccessKey.data;
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .send({
        accessKeyId,
        secretAccessKey,
        title: 'Test Todo',
        description: 'This is a test todo',
      })
      .expect(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body).toHaveProperty('title', 'Test Todo');
    expect(createResponse.body).toHaveProperty('description', 'This is a test todo');
    expect(createResponse.body).toHaveProperty('completed', false);
    expect(createResponse.body).toHaveProperty('userId', 'user123');
    await new Promise((resolve) => {
      clientSocket = io('http://localhost:3000/', {
        query: {
          accessKeyId,
          secretAccessKey
        },
        transports: ['websocket']
      });
    clientSocket.on('connect', () => {
      console.log('WebSocket client connected');
        resolve('');
    });
    });
    // 
    setTimeout(async () => {
    await request(app.getHttpServer())
      .put(`/todos/${createResponse.body.id}/complete`)
      .send({
        accessKeyId,
        secretAccessKey,
      })
      .expect(200);
    }, 100);
    await new Promise((resolve) => {
      clientSocket.on('notification', (message: string) => {
        console.log('Received notification:', message);
        if (message === `Your todo "Test Todo" is completed!`) {
          resolve('');
        }
      });
    });
    console.log('Completed todo');
  }, 60_000);
  afterEach(() => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
    app.close();
  });
});
