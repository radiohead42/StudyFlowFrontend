import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Subjects {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/subjects`;

  getAll(){
    return this.http.get(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<{
      id: number;
      name: string;
      teacher: string;
    }>(`${this.apiUrl}/${id}`);
  }

  create(name: string, teacher: string) {
    return this.http.post(this.apiUrl, { name, teacher });
  }

  update(id: number, name: string, teacher: string) {
    return this.http.put(`${this.apiUrl}/${id}`, { name, teacher });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
