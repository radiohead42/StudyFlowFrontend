import { Component, inject } from '@angular/core';
import { Subjects } from '../../../core/subjects/subjects.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink],
  selector: 'app-subject-create',
  styleUrl: './subject-create.component.scss',
  templateUrl: './subject-create.component.html',
})
export class SubjectCreate {

  private readonly subjectService = inject(Subjects);
  private readonly router = inject(Router);

  name = '';
  teacher = '';
  error = '';

  create(): void {
    this.error = '';

    this.subjectService.create(this.name, this.teacher)
      .subscribe({
                next: () => {
                  this.router.navigate(['/subjects']);
                },
                error: () => {
                  this.error = 'No se puede crear la materia';
                }
      });
  }
}
