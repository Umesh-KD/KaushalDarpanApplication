import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlacedStudentComponent } from './view-placed-student.component';

describe('ViewPlacedStudentComponent', () => {
  let component: ViewPlacedStudentComponent;
  let fixture: ComponentFixture<ViewPlacedStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPlacedStudentComponent]
    });
    fixture = TestBed.createComponent(ViewPlacedStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
