import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ChatService {
  private API = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    return this.http.post<any>(this.API, {
      message: message,
      role: 'STUDENT'
    });
  }
}
