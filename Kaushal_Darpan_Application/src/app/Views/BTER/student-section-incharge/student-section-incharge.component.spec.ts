import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSectionInchargeComponent } from './student-section-incharge.component';

describe('StudentSectionInchargeComponent', () => {
  let component: StudentSectionInchargeComponent;
  let fixture: ComponentFixture<StudentSectionInchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentSectionInchargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSectionInchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
