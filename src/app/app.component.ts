import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AIGenerationService } from './services/aichat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'aichat';
  inputText: string = '';
  generatedContent: string = '';

  constructor(public myService: AIGenerationService) {
    this.generateContent();
  }

  generateContent() {
    this.myService.generateContent(this.inputText).subscribe(
      (content) => {this.generatedContent = content;
    }
    
  );

  }
}
