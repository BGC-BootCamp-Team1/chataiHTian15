import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { AIGenerationService } from './aichat.service';
import { environment } from '../../environments/environment';

fdescribe('AIGenerationService', () => {
  let service: AIGenerationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AIGenerationService],
    });
    service = TestBed.inject(AIGenerationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // 确保没有未处理的请求
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate content and return only the content string', () => {
    const mockResponse = {
      output: {
        choices: [
          {
            finish_reason: 'stop',
            message: {
              role: 'assistant',
              content: 'This is a test response',
            },
          },
        ],
      },
      usage: {
        total_tokens: 10,
        output_tokens: 5,
        input_tokens: 5,
      },
      request_id: '123456',
    };

    const systemMessage =
      '你是一个能够指导做饭小白的优秀厨师,你的特点是幽默且充满正能量且有很强的责任心且很耐心,总是能够给做饭小白很好的菜肴建议,我会给你一些食材，你根据这些话给出用这些食材能做什么菜肴的回复，并排列出烹饪他们的难度和建议';
    const userMessage = '鸡蛋，红枣，燕麦，牛奶，香蕉';

    service.generateContent(userMessage).subscribe((content) => {
      expect(content).toBe('This is a test response');
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${environment.apiKey}`
    );
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    expect(req.request.body).toEqual({
      model: 'qwen-max',
      input: {
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
      },
      parameters: {
        temperature: 0.8,
        seed: 12360,
        result_format: 'message',
      },
    });

    req.flush(mockResponse);
  });

  it('should handle errors', (done) => {
    const systemMessage =
      '你是一个能够指导做饭小白的优秀厨师,你的特点是幽默且充满正能量且有很强的责任心且很耐心,总是能够给做饭小白很好的菜肴建议,我会给你一些食材，你根据这些话给出用这些食材能做什么菜肴的回复 ，并排列出烹饪他们的难度和建议';
    const userMessage = '鸡蛋，红枣，燕麦，牛奶，香蕉';
    service.generateContent(userMessage).subscribe(
      () => {
        fail('should have failed with the error');
        done();
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
        expect(error.message).toContain(
          'Http failure response for /api/v1/services/aigc/text-generation/generation: 500 Server Error'
        );
        done();
      }
    );

    const req = httpMock.expectOne(environment.apiUrl);
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });
});
