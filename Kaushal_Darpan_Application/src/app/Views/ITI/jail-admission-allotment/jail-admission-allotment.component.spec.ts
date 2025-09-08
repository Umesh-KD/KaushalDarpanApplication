import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JailAdmissionAllotmentComponent } from './jail-admission-allotment.component';

describe('JailAdmissionAllotmentComponent', () => {
  let component: JailAdmissionAllotmentComponent;
  let fixture: ComponentFixture<JailAdmissionAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JailAdmissionAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JailAdmissionAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
