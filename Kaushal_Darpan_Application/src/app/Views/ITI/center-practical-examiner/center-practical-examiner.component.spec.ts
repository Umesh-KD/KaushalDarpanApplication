import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterPracticalExaminerComponent } from './center-practical-examiner.component';

describe('CenterPracticalExaminerComponent', () => {
  let component: CenterPracticalExaminerComponent;
  let fixture: ComponentFixture<CenterPracticalExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterPracticalExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterPracticalExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
