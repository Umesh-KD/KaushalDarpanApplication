import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEnrollmentITIComponent } from './generate-enrollment-iti.component';

describe('GenerateEnrollmentITIComponent', () => {
  let component: GenerateEnrollmentITIComponent;
  let fixture: ComponentFixture<GenerateEnrollmentITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateEnrollmentITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateEnrollmentITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
