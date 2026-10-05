import { Component, inject, OnInit, signal } from '@angular/core';
import { Tasks } from '../../../core/tasks/tasks.service';

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
  imports: [],
  selector: 'app-tasks-list',
  styleUrl: './tasks-list.component.scss',
  templateUrl: './tasks-list.component.html',
})
export class TasksList implements OnInit {

  private readonly taskService = inject(Tasks);

  tasks = signal<Task[]>([]);

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

