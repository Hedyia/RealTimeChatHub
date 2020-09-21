import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { createConnection } from 'net';
import { Message } from '../models/message';

@Injectable()
export class ChatService {
    messageReceived = new EventEmitter<Message>();
    connectionEstablished = new EventEmitter<Boolean>();

    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor() {
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }
    sendMessage(message:Message) {
        this._hubConnection.invoke('SendMessage', message, 'hello');
    }
    private createConnection() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/chat")
            .build();
    }
    private startConnection(): void {

        this._hubConnection.start().then(() => {
            this.connectionIsEstablished = true;
            console.log('Hub connection started');
            this.connectionEstablished.emit(true);
        }).catch(err => {
            console.log('Error while establishing connection, retrying...');
            console.log(err);
        });
    }
    private registerOnServerEvents() : void {
        this._hubConnection.on('ReceiveMessage', (data:any) => {
            this.messageReceived.emit(data);
        });
    }
}
