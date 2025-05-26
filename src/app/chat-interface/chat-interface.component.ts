import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface PromptSuggestion {
  text: string;
  icon: string;
  category: 'horoscope' | 'tarot' | 'zodiac' | 'general';
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
  showSuggestions: boolean = true;

  promptSuggestions: PromptSuggestion[] = [
    { 
      text: "What does my zodiac sign say about my personality?",
      icon: "fa-star",
      category: 'zodiac'
    },
    { 
      text: "What's in store for me this week?",
      icon: "fa-moon",
      category: 'horoscope'
    },
    { 
      text: "How do the planets affect my love life?",
      icon: "fa-heart",
      category: 'horoscope'
    },
    { 
      text: "What career path aligns with my stars?",
      icon: "fa-briefcase",
      category: 'zodiac'
    },
    { 
      text: "Tell me about my spiritual journey",
      icon: "fa-road",
      category: 'general'
    },
    { 
      text: "What do the tarot cards reveal about my future?",
      icon: "fa-cards",
      category: 'tarot'
    }
  ];

  constructor(private apiService: ApiService) {
    // Initialize with a welcome message
    this.messages.push({
      content: 'Hello! I am your mystical guide. How can I assist you today? 🌟',
      sender: 'ai',
      timestamp: new Date()
    });
  }

  ngOnInit(): void {}

  usePromptSuggestion(suggestion: PromptSuggestion): void {
    this.newMessage = suggestion.text;
    this.showSuggestions = false;
  }

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

    // Clear input and hide suggestions
    this.newMessage = '';
    this.showSuggestions = false;

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

  // Show suggestions when input is focused and empty
  onInputFocus(): void {
    if (!this.newMessage) {
      this.showSuggestions = true;
    }
  }

  // Hide suggestions when input is blurred
  onInputBlur(): void {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
