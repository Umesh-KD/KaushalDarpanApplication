import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterSuperintendentStudentComponent } from './center-superintendent-student.component';

describe('CenterSuperintendentStudentComponent', () => {
  let component: CenterSuperintendentStudentComponent;
  let fixture: ComponentFixture<CenterSuperintendentStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterSuperintendentStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterSuperintendentStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
