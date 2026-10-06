import { Component, inject, OnInit, signal } from '@angular/core';
import { Subjects } from '../../../core/subjects/subjects.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Tasks } from '../../../core/tasks/tasks.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

interface Subject {
  id: number;
  name: string;
  teacher: string;
}

@Component({
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatDatepickerModule],
  selector: 'app-task-create',
  styleUrl: './task-create.component.scss',
  templateUrl: './task-create.component.html',
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'}
  ]
})
export class TaskCreate implements OnInit {

  private readonly taskService = inject(Tasks);
  private readonly subjectsService = inject(Subjects);
  private readonly router = inject(Router);

  subjects = signal<Subject[]>([]);

  subjectId = 0;

  title = '';
  description = '';
  dueDate: Date | null = null;
  priority = '';
  status = '';

  error = '';

  ngOnInit(): void {
    this.subjectsService.getAll()
    .subscribe({
      next: response => {
        this.subjects.set(response as Subject[]);
      },
      error: err => {
        console.error('Error fetching subjects:', err);
      }
    });
  }

  create(): void {
    this.error = '';

    if (!this.dueDate) {
      this.error = 'Selecciona una fecha limite';
      return;
    }

    const year = this.dueDate.getFullYear();
    const month = String(this.dueDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.dueDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T00:00:00Z`;

    this.taskService.create(this.title, this.description, formattedDate, this.priority, this.status, this.subjectId)
    .subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: err => {
        console.error('Error creating task:', err);
        this.error = 'Failed to create task. Please try again.';
      }
    });
  }

}
