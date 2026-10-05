import { Component, inject } from '@angular/core';
import { Auth } from '../../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class Login {

  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  email = '';
  password = '';

  message = '';
  error = '';

  login(): void {
    this.message = '';
    this.error = '';

    this.authService.login(this.email, this.password)
      .subscribe({
                next: () => {
                  this.router.navigate(['/subjects']);
                },
                error: err => {
                  this.error = 'Error al iniciar sesion';
                  console.log(err);
                }
      });
  }
}
