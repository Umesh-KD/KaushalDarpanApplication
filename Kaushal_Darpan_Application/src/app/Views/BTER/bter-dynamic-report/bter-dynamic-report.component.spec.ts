import { ComponentFixture, TestBed } from '@angular/core/testing';

import { admission-allotment-reportComponent } from './admission-allotment-report.component';

describe('admission-allotment-reportComponent', () => {
  let component: admission-allotment-reportComponent;
  let fixture: ComponentFixture<admission-allotment-reportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [admission-allotment-reportComponent]
    });
    fixture = TestBed.createComponent(admission-allotment-reportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
