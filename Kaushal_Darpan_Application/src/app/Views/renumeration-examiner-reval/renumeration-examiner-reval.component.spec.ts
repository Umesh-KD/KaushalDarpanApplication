import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerationExaminerRevalComponent } from './renumeration-examiner-reval.component';

describe('RenumerationExaminerRevalComponent', () => {
  let component: RenumerationExaminerRevalComponent;
  let fixture: ComponentFixture<RenumerationExaminerRevalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenumerationExaminerRevalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenumerationExaminerRevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
