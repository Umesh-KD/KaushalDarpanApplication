  import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCenteredActivitesMasterComponent } from './student-centered-activites-master.component';

describe('StudentCenteredActivitesMasterComponent', () => {
  let component: StudentCenteredActivitesMasterComponent;
  let fixture: ComponentFixture<StudentCenteredActivitesMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentCenteredActivitesMasterComponent]
    });
    fixture = TestBed.createComponent(StudentCenteredActivitesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
