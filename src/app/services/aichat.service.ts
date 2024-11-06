// AIGenerationService

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

// 定义接口类型来描述响应结构
export interface TextGenerationResponse {
  output: {
    choices: [
      {
        finish_reason: string;
        message: {
          role: string;
          content: string;
        }
      }
    ];
  };
  usage: {
    total_tokens: number;
    output_tokens: number;
    input_tokens: number;
  };
  request_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIGenerationService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  // 定义方法并只返回 content 字段
  generateContent(inputText:string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      "model": "qwen-max",
      "input": {
        "messages": [
          { "role": "system", "content": "你是一个能够指导做饭小白的优秀厨师,你的特点是幽默且充满正能量且有很强的责任心且很耐心,总是能够给做饭小白很好的菜肴建议,我会给你一些食材，你根据这些话给出用这些食材能做什么菜肴的回复，并排列出烹饪他们的难度和建议" },
          { "content": inputText, "role": "user" }
        ]
      },
      "parameters": {
        "temperature": 0.8,
        "seed": 12360,
        "result_format": "message"
      }
    };

    // 使用 map 操作符从响应中提取 content 字段
    return this.http.post<TextGenerationResponse>(this.apiUrl, body, { headers }).pipe(
      map(response => response.output.choices[0].message.content)
    );
  }
}
