import { Component, inject } from '@angular/core';
import { Auth } from '../../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink, MatSnackBarModule],
  selector: 'app-register',
  styleUrl: './register.component.scss',
  templateUrl: './register.component.html',
})
export class Register {
  private readonly authService = inject(Auth);
  private readonly snackBar = inject(MatSnackBar);

  email = '';
  password = '';
  confirmPassword = '';

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  register(): void {

    if (!this.passwordsMatch) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.snackBar.open('usuario registrado correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });

        this.email = '';
        this.password = '';
      },
      error: () => {
        this.snackBar.open(`No se pudo registrar el usuario`, 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      },
    });
  }
}
