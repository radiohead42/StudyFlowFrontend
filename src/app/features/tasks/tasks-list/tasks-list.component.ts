import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Tasks } from '../../../core/tasks/tasks.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  subjectId: number;
}

interface TasksResponse {
  items: Task[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Component({
  imports: [RouterLink, DatePipe, MatButtonModule, MatCardModule, MatSnackBarModule, MatFormFieldModule, MatInputModule],
  selector: 'app-tasks-list',
  styleUrl: './tasks-list.component.scss',
  templateUrl: './tasks-list.component.html',
})
export class TasksList implements OnInit {

  private readonly taskService = inject(Tasks);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  tasks = signal<Task[]>([]);
  searchTerm = signal<string>('');

  filteredTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.tasks();
    }

    return this.tasks()
    .filter(task =>
            task.title.toLowerCase().includes(term) ||
              task.description.toLowerCase().includes(term));
  });


  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar tarea',
        message: '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed()
    .subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.taskService.delete(id)
      .subscribe({
        next: () => {

          this.snackBar.open(
            'Tarea eliminada correctamente',
            'Cerrar',
            { duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'] }
          );

          this.tasks.update(tasks =>
                            tasks.filter(task => task.id !== id)
                           );
        },
        error: () => {
          this.snackBar.open('Error en eliminar la tarea', 'cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.taskService.getAll()
    .subscribe({
      next: response => {
        const result = response as TasksResponse;
        this.tasks.set(result.items);
      },
      error: err => {
        console.error('Error al obtener las tareas:', err);
      }
    });
  }
}
