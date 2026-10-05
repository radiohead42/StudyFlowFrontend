import { Component, inject } from '@angular/core';
import { Auth } from '../../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.scss',
  templateUrl: './register.component.html',
})
export class Register {
  private readonly authService = inject(Auth);

  email = '';
  password = '';

  message = '';
  error = '';

  register(): void {
    this.message = '';
    this.error = '';

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.message = 'Cuenta creada correctamente';
      },
      error: () => {
        this.error = 'No se pudo crear la cuenta';
      },
    });
  }
}
