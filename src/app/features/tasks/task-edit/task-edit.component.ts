import { Component, inject, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Tasks } from '../../../core/tasks/tasks.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subjects } from '../../../core/subjects/subjects.service';

type TaskStatus =
  | 'Pending'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

type TaskPriority =
  | 'Low'
  | 'Medium'
  | 'High';

interface TaskResponse {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: number;
  priority: TaskPriority;

  subject: {
    id: number;
    name: string;
  };
}

interface Subject {
  id: number;
  name: string;
  teacher: string;
}

@Component({
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatDatepickerModule],
  selector: 'app-task-edit',
  styleUrl: './task-edit.component.scss',
  templateUrl: './task-edit.component.html',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-MX'
    }
  ]
})
export class TaskEdit implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly tasksService = inject(Tasks);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subjectsService = inject(Subjects);
  private readonly router = inject(Router);

  error = '';

  title = '';
  description = '';
  dueDate: Date | null = null;
  status: TaskStatus = 'Pending';
  priority: TaskPriority = 'Medium';

  subjectId = 0;

  subjects = signal<Subject[]>([]);

  taskId = Number(this.route.snapshot.paramMap.get('id'));

  update(): void {

  this.error = '';

  if (!this.dueDate) {
    this.error =
      'Selecciona una fecha límite';
    return;
  }

  if (this.subjectId === 0) {
    this.error =
      'Selecciona una materia';
    return;
  }


  const year =
    this.dueDate.getFullYear();

  const month =
    String(
      this.dueDate.getMonth() + 1
    ).padStart(2, '0');

  const day =
    String(
      this.dueDate.getDate()
    ).padStart(2, '0');


  const formattedDueDate =
    `${year}-${month}-${day}T00:00:00Z`;


  this.tasksService
    .update(
      this.taskId,
      this.title,
      this.description,
      formattedDueDate,
      this.priority,
      this.status,
      this.subjectId
    )
    .subscribe({

      next: () => {
        this.router.navigate([
          '/tasks'
        ]);
      },

      error: () => {
        this.error =
          'No se pudo actualizar la tarea';
      }

    });
}

  private mapStatus(status: number): TaskStatus {

  switch (status) {

    case 0:
      return 'Pending';

    case 1:
      return 'InProgress';

    case 2:
      return 'Completed';

    case 3:
      return 'Cancelled';

    default:
      return 'Pending';
  }
  }

  ngOnInit(): void {

    this.subjectsService
    .getAll()
    .subscribe({
      next: response => {
        console.log('Materias cargadas', response);
        this.subjects.set(
          response as Subject[]
        );
      },

      error: error => {
        console.error(
          'No se pudieron cargar las materias',
          error
        );
      }
    });

    this.tasksService.getById(this.taskId)
    .subscribe({

      next: response => {

        const task = response as TaskResponse;

        this.title = task.title;
        this.description = task.description;
        const [year, month, day] =
          task.dueDate
        .slice(0, 10)
        .split('-')
        .map(Number);

        this.dueDate =
          new Date(
            year,
            month - 1,
            day
        );
        this.status = this.mapStatus(task.status);
        this.priority = task.priority;
        this.subjectId = task.subject.id;

        this.cdr.markForCheck();

      },

      error: error => {
        console.error('No se pudo obtener la tarea', error);
      }
    });

  }

}
