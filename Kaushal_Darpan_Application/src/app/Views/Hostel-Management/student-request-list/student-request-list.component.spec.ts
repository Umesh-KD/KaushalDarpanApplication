import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRequestListComponent } from './student-request-list.component';

describe('StudentRequestListComponent', () => {
  let component: StudentRequestListComponent;
  let fixture: ComponentFixture<StudentRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
