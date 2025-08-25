import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsJanaadharComponent } from './students-janaadhar.component';

describe('StudentsJanaadharComponent', () => {
  let component: StudentsJanaadharComponent;
  let fixture: ComponentFixture<StudentsJanaadharComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsJanaadharComponent]
    });
    fixture = TestBed.createComponent(StudentsJanaadharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
