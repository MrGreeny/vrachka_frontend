import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    }
  }>;
}

interface ChatRequest {
  prompt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Example method for API calls
  getHoroscope(sign: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/horoscope/${sign}`);
  }

  // Add more API methods as needed
  sendMessage(message: string): Observable<string> {
    const payload: ChatRequest = { prompt: message };
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, payload).pipe(
      map(response => response.choices[0].message.content)
    );
  }
} 