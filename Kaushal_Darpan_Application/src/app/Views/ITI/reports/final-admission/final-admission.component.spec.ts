import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalAdmissionComponent } from './final-admission.component';

describe('FinalAdmissionComponent', () => {
  let component: FinalAdmissionComponent;
  let fixture: ComponentFixture<FinalAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalAdmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
