import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsJoiningStatusMarksComponent } from './students-joining-status-marks.component';

describe('StudentsJoiningStatusMarksComponent', () => {
  let component: StudentsJoiningStatusMarksComponent;
  let fixture: ComponentFixture<StudentsJoiningStatusMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentsJoiningStatusMarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsJoiningStatusMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
