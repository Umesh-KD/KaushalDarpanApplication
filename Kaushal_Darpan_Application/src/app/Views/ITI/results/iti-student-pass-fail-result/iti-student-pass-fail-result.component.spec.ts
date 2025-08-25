import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiStudentPassFailResultComponent } from './iti-student-pass-fail-result.component';

describe('VerifyItiCenterObserverDeploymentComponent', () => {
  let component: itiStudentPassFailResultComponent;
  let fixture: ComponentFixture<itiStudentPassFailResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [itiStudentPassFailResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiStudentPassFailResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
