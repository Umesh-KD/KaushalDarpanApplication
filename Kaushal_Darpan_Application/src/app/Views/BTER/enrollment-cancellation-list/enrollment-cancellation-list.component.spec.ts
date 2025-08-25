import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentCancellationListComponent } from './enrollment-cancellation-list.component';

describe('EnrollmentCancellationListComponent', () => {
  let component: EnrollmentCancellationListComponent;
  let fixture: ComponentFixture<EnrollmentCancellationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollmentCancellationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentCancellationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
