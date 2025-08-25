import { ComponentFixture, TestBed } from '@angular/core/testing';

import {DispatchSuperintendentAllottedExamDateListComponent } from './DispatchSuperintendentAllottedExamDateList.component';

describe('QualificationFormComponent', () => {
  let component: DispatchSuperintendentAllottedExamDateListComponent;
  let fixture: ComponentFixture<DispatchSuperintendentAllottedExamDateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchSuperintendentAllottedExamDateListComponent]
    });
    fixture = TestBed.createComponent(DispatchSuperintendentAllottedExamDateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
