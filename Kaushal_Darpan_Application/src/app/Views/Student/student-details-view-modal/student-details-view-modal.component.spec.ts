import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsViewModalComponent } from './student-details-view-modal.component';

describe('StudentDetailsViewModalComponent', () => {
  let component: StudentDetailsViewModalComponent;
  let fixture: ComponentFixture<StudentDetailsViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailsViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDetailsViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
