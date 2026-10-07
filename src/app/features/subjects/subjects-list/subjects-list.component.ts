import { Component, inject, OnInit, signal } from '@angular/core';
import { Subjects } from '../../../core/subjects/subjects.service';
import { Auth } from '../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog.component';

interface Subject {
  id: number;
  name: string;
  teacher: string;
}

@Component({
  imports: [RouterLink, MatButtonModule, MatCardModule, MatSnackBarModule],
  selector: 'app-subjects-list',
  styleUrl: './subjects-list.component.scss',
  templateUrl: './subjects-list.component.html',
})
export class SubjectsList implements OnInit {

  private readonly subjectsService = inject(Subjects);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

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

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420',
      data: {
        title: 'Elimiar materia',
        message: '¿Estás seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed()
    .subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.subjectsService.delete(id)
      .subscribe({
        next: () => {

          this.snackBar.open('Materia eliminada correctamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });

          this.subjects.update(subjects => subjects.filter(subject => subject.id !== id));
        },
        error: () => {
          this.snackBar.open('Error al eliminar la materia', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        }
      });
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
