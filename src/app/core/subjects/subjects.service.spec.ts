import { TestBed } from '@angular/core/testing';
import { Subjects } from './subjects.service';

describe('Subjects', () => {
  let service: Subjects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Subjects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
