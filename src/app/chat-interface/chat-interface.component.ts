import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})
export class ChatInterfaceComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;

  constructor(private apiService: ApiService) {
    // Initialize with a welcome message
    this.messages.push({
      content: 'Hello! I am your mystical guide. How can I assist you today? 🌟',
      sender: 'ai',
      timestamp: new Date()
    });
  }

  ngOnInit(): void {}

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    const userMessage = this.newMessage;

    // Add user message
    this.messages.push({
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    });

    // Show typing indicator
    this.isTyping = true;

    // Clear input
    this.newMessage = '';

    // Send message to API
    this.apiService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.messages.push({
          content: response,
          sender: 'ai',
          timestamp: new Date()
        });
        this.isTyping = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messages.push({
          content: 'The cosmic connection seems disturbed. Please try again later... 🌌',
          sender: 'ai',
          timestamp: new Date()
        });
        this.isTyping = false;
      }
    });
  }
}
