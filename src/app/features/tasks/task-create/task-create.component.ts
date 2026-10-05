import { Component, inject, OnInit, signal } from '@angular/core';
import { Subjects } from '../../../core/subjects/subjects.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tasks } from '../../../core/tasks/tasks.service';

interface Subject {
  id: number;
  name: string;
  teacher: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-task-create',
  styleUrl: './task-create.component.scss',
  templateUrl: './task-create.component.html',
})
export class TaskCreate implements OnInit {

  private readonly taskService = inject(Tasks);
  private readonly subjectsService = inject(Subjects);
  private readonly router = inject(Router);

  subjects = signal<Subject[]>([]);

  subjectId = 0;

  title = '';
  description = '';
  dueDate = '';
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

    this.taskService.create(this.title, this.description, this.dueDate, this.priority, this.status, this.subjectId)
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
