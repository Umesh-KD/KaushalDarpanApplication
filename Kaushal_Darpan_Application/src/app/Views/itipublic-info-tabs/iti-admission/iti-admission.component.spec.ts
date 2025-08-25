import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiAdmissionComponent } from './iti-admission.component';

describe('ItiAdmissionComponent', () => {
  let component: ItiAdmissionComponent;
  let fixture: ComponentFixture<ItiAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiAdmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
