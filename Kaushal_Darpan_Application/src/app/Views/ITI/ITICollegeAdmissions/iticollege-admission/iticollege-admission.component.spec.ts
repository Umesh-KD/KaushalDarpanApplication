import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICollegeAdmissionComponent } from './iticollege-admission.component';

describe('ITICollegeAdmissionComponent', () => {
  let component: ITICollegeAdmissionComponent;
  let fixture: ComponentFixture<ITICollegeAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITICollegeAdmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITICollegeAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
