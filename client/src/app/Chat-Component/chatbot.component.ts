import { Component } from "@angular/core";
import { ChatService } from "../../services/ChatService";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent {

  userMessage = '';
  messages: any[] = [];

  constructor(private chatService: ChatService) {}

  send() {
    this.messages.push({ from: 'user', text: this.userMessage });

    this.chatService.sendMessage(this.userMessage).subscribe(res => {
      this.messages.push({ from: 'bot', text: res.reply });
    });

    this.userMessage = '';
  }
}
