import { Component, inject } from '@angular/core';
import { Auth } from '../../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink, MatSnackBarModule],
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class Login {

  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  email = '';
  password = '';


  login(): void {

    this.authService.login(this.email, this.password)
    .subscribe({
      next: () => {

        this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });

        this.router.navigate(['/subjects']);
      },
      error: () => {
        this.snackBar.open('Error al iniciar sesión: ' , 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
