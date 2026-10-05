import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectCreate } from './subject-create.component';

describe('SubjectCreate', () => {
  let component: SubjectCreate;
  let fixture: ComponentFixture<SubjectCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
