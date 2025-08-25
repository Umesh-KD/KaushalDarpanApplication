import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiExaminerComponent } from './iti-examiner.component';

describe('ItiExaminerComponent', () => {
  let component: ItiExaminerComponent;
  let fixture: ComponentFixture<ItiExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
