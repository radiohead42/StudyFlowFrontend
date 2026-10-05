import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Tasks {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  getAll() {
    return this.http.get(this.apiUrl);
  }

  create(title: string, description: string, dueDate: string, priority: string, status: string, subjectId: number) {
    return this.http.post(this.apiUrl, { title, description, dueDate, priority, status, subjectId });
  }

}
