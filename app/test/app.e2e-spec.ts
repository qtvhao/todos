// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { io, Socket } from 'socket.io-client';

// npx jest   test/app.e2e-spec.ts
describe('Todo App (e2e)', () => {
  let app: INestApplication;
  let clientSocket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a todo, assign permission, complete it, and receive a notification', async (done) => {
    // Define the access keys (these are mock values)
    const accessKeyId = 'test-access-key';
    const secretAccessKey = 'test-secret-key';

    // Step 1: Create a new Todo
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .send({
        accessKeyId,
        secretAccessKey,
        title: 'Test Todo',
        description: 'This is a test todo',
      })
      .expect(201);

    const todo = createResponse.body;
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('title', 'Test Todo');
    expect(todo).toHaveProperty('description', 'This is a test todo');
    expect(todo).toHaveProperty('completed', false);

    // Step 2: Connect WebSocket client and listen for notifications
    clientSocket = io('http://localhost:3000/notifications', {
      query: {
        accessKeyId,
        secretAccessKey,
      },
      transports: ['websocket'],
    });

    clientSocket.on('connect', () => {
      console.log('WebSocket client connected');
    });

    clientSocket.on('notification', (message: string) => {
      expect(message).toBe(`Your todo "${todo.title}" is completed!`);
      done();
    });

    // Step 3: Complete the Todo
    await request(app.getHttpServer())
      .put(`/todos/${todo.id}/complete`)
      .send({
        accessKeyId,
        secretAccessKey,
      })
      .expect(200);
  });

  afterEach(() => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
  });
});
