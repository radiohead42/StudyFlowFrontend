import { Component, inject, OnInit, signal } from '@angular/core';
import { Tasks } from '../../../core/tasks/tasks.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  imports: [RouterLink, DatePipe, MatButtonModule, MatCardModule],
  selector: 'app-tasks-list',
  styleUrl: './tasks-list.component.scss',
  templateUrl: './tasks-list.component.html',
})
export class TasksList implements OnInit {

  private readonly taskService = inject(Tasks);

  tasks = signal<Task[]>([]);

  deleteTask(id: number): void {
    this.taskService.delete(id)
    .subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(task => task.id !== id));
      },
      error: err => {
        console.error('Error al eliminar la tarea:', err);
      }
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

