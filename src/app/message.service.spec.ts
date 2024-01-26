import { MessageService } from "./message.service"

describe('MessageService', () => {
    let service: MessageService;

    it('should start with no messages', () => {
        // arrange
        service = new MessageService();

        // act

        // assert
        expect(service.messages.length).toBe(0);
    });

    it('should add a message when add is called', () => {
        // arrange
        service = new MessageService();

        // act
        service.add('message 1');

        // assert
        expect(service.messages.length).toBe(1);
    });

    it('should remove messages when clear is called', () => {
        // arrange
        service = new MessageService();
        service.add('message 1');

        // act
        service.clear();

        // assert
        expect(service.messages.length).toBe(0);
    });
})