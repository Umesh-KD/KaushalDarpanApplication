import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEnrollNoComponent } from './verify-enroll-no.component';

describe('VerifyEnrollNoComponent', () => {
  let component: VerifyEnrollNoComponent;
  let fixture: ComponentFixture<VerifyEnrollNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEnrollNoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEnrollNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
