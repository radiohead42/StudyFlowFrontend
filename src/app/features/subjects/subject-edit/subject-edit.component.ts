import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subjects } from '../../../core/subjects/subjects.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  selector: 'app-subject-edit',
  styleUrl: './subject-edit.component.scss',
  templateUrl: './subject-edit.component.html',
})
export class SubjectEdit implements OnInit {

  private readonly router = inject(ActivatedRoute);
  private readonly routerNavigate = inject(Router);
  private readonly subjectsService = inject(Subjects);
  private readonly cdr = inject(ChangeDetectorRef);

  subjectId = Number(this.router.snapshot.paramMap.get('id'));

  name = '';
  teacher = '';

  ngOnInit() {
    this.subjectsService.getById(this.subjectId)
    .subscribe({
      next: subject => {
        this.name = subject.name;
        this.teacher = subject.teacher;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error fetching subject:', error);
      }
    });
  }

  update(): void {
    this.subjectsService.update(this.subjectId, this.name, this.teacher)
    .subscribe({
      next: () => {
        this.routerNavigate.navigate(['/subjects']);
      },
      error: error => {
        console.error('Error updating subject:', error);
      }
    });
  }
}
