import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaleFemaleAdmissionComponent } from './male-female-admission.component';

describe('FinalAdmissionComponent', () => {
  let component: MaleFemaleAdmissionComponent;
  let fixture: ComponentFixture<MaleFemaleAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaleFemaleAdmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaleFemaleAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
