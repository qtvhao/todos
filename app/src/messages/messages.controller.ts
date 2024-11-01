import { Controller, Get, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
    private messages = [
        { "id": 1, "sender": "Alice", "text": "Hello everyone!", "timestamp": "2023-10-01T10:00:00Z", "threadId": "General" },
        { "id": 2, "sender": "Bob", "text": "Hi Alice!", "timestamp": "2023-10-01T10:01:00Z", "threadId": "General" },
        { "id": 3, "sender": "Charlie", "text": "Random thoughts...", "timestamp": "2023-10-01T09:00:00Z", "threadId": "Random" },
        { "id": 4, "sender": "Dana", "text": "Anyone here?", "timestamp": "2023-10-01T09:05:00Z", "threadId": "Random" }
    ];

    @Get()
    findAll(): object {
        return {
            "messages": this.messages
        };
    }

    @Post()
    create(): object {
        const message = {
            "id": 5,
            "sender": "Alice",
            "text": "I'm new here",
            "timestamp": "2023-10-01T10:05:00Z",
            "threadId": "General"
        };
        this.messages.push(message);

        return {
            "message": message
        };
    }
}
