import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJoinStatusComponent } from './student-join-status.component';

describe('StudentJoinStatusComponent', () => {
  let component: StudentJoinStatusComponent;
  let fixture: ComponentFixture<StudentJoinStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentJoinStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentJoinStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
