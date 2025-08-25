import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticalExaminerRelievingComponent } from './practical-examiner-relieving.component';

describe('PracticalExaminerRelievingComponent', () => {
  let component: PracticalExaminerRelievingComponent;
  let fixture: ComponentFixture<PracticalExaminerRelievingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticalExaminerRelievingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticalExaminerRelievingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
