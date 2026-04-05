import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  messages: { sender: string, text: string }[] = [
    { sender: 'AI', text: 'Hello 👋, ask your questions!' } // ✅ initial greeting
  ];
  userInput: string = '';
  isOpen: boolean = false; // toggle for popup
 
  constructor(private httpService: HttpService) {}
 
  toggleChat() {
    this.isOpen = !this.isOpen;
  }
 
  sendMessage() {
    if (!this.userInput.trim()) return;
 
    this.messages.push({ sender: 'You', text: this.userInput });
 
    this.httpService.sendMessage(this.userInput).subscribe({
      next: (response) => {
        this.messages.push({ sender: 'AI', text: response });
      },
      error: () => {
        this.messages.push({ sender: 'AI', text: 'Error: Could not get response.' });
      }
    });
 
    this.userInput = '';
  }
}