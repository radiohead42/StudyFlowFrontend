import { Component, inject, OnInit, signal } from '@angular/core';
import { Subjects } from '../../../core/subjects/subjects.service';
import { Auth } from '../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface Subject {
  id: number;
  name: string;
  teacher: string;
}

@Component({
  imports: [RouterLink, MatButtonModule, MatCardModule],
  selector: 'app-subjects-list',
  styleUrl: './subjects-list.component.scss',
  templateUrl: './subjects-list.component.html',
})
export class SubjectsList implements OnInit {

  private readonly subjectsService = inject(Subjects);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  subjects = signal<Subject[]>([]);

  ngOnInit(): void {
    this.subjectsService
    .getAll()
    .subscribe({
      next: response => {
        this.subjects.set(response as Subject[]);
      },
      error: error => {
        console.error('Error al obtener las materias:', error);
      }
    });
  }

  deleteSubject(id: number) {
    this.subjectsService.delete(id)
    .subscribe({
      next: () => {
        this.subjects.update(subjects => subjects.filter(subject => subject.id !== id));
      },
      error: error => {
        console.error('Error al eliminar la materia:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
