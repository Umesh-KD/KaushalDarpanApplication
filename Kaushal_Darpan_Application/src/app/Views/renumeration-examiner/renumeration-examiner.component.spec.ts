import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerationExaminerComponent } from './renumeration-examiner.component';

describe('RenumerationExaminerComponent', () => {
  let component: RenumerationExaminerComponent;
  let fixture: ComponentFixture<RenumerationExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenumerationExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenumerationExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
