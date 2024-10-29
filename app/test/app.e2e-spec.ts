import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let clientSocket: Socket;
  let clientSocket2: Socket;

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

  // To run this test: yarn test:e2e app/test/app.e2e-spec.ts -t='should create two users, create two access keys, create a todo, and receive notifications'
  it('should create two users, create two access keys, create a todo, and receive notifications', async () => {
    let user1 = await axios.post(BASE_URL + '/users/create', { user_id: 'user123', name: 'John Doe', email: 'johndoe@example.com', attributes: { department: 'engineering', role: 'developer' } });
    let user2 = await axios.post(BASE_URL + '/users/create', { user_id: 'user124', name: 'Hao Nghiem', email: 'qtvhao@gmail.com', attributes: { department: 'engineering', role: 'developer' } });
    let createAccessKey1 = await axios.post(BASE_URL + '/access-keys/create', { user_id: 'user123', description: 'My new access key' });
    let createAccessKey2 = await axios.post(BASE_URL + '/access-keys/create', { user_id: 'user124', description: 'My new access key' });
    let {
      access_key: { access_key_id: accessKeyId1, secret_access_key: secretAccessKey1 },
    } = createAccessKey1.data;
    let {
      access_key: { access_key_id: accessKeyId2, secret_access_key: secretAccessKey2 },
    } = createAccessKey2.data;
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .send({
        accessKeyId: accessKeyId1,
        secretAccessKey: secretAccessKey1,
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
          accessKeyId: accessKeyId1,
          secretAccessKey: secretAccessKey1
        },
        transports: ['websocket']
      });
      clientSocket.on('connect', () => {
        // console.log('WebSocket client connected');
        resolve('');
      });
    });
    await new Promise((resolve) => {
      clientSocket2 = io('http://localhost:3000/', {
        query: {
          accessKeyId: accessKeyId2,
          secretAccessKey: secretAccessKey2
        },
        transports: ['websocket']
      });
      clientSocket2.on('connect', () => {
        // console.log('WebSocket client connected');
        resolve('');
      });
    });
    //
    setTimeout(async () => {
      await request(app.getHttpServer())
        .put(`/todos/${createResponse.body.id}/complete`)
        .send({
          accessKeyId: accessKeyId1,
          secretAccessKey: secretAccessKey1,
        })
        .expect(200);
    }, 100);
    const [notification1, notification2] = await Promise.all([
      new Promise((resolve) => {
      console.log('clientSocket will receive notification');
      const timeout = setTimeout(() => resolve(false), 5000);
      clientSocket.on('notification', (message: string) => {
        clearTimeout(timeout);
        resolve(message);
      });
      }),
      new Promise((resolve) => {
      console.log('clientSocket2 will not receive notification');
      const timeout = setTimeout(() => resolve(false), 5000);
      clientSocket2.on('notification', (message: string) => {
        clearTimeout(timeout);
        resolve(message);
      });
      })
    ]);

    expect(notification1).toBe(`Your todo "Test Todo" is completed!`);
    expect(notification2).toBe(false);
  }, 60_000);
  afterEach(() => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
    if (clientSocket2) {
      clientSocket2.disconnect();
    }
    app.close();
  });
});
