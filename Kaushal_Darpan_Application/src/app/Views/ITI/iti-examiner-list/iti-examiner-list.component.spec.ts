import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiExaminerListComponent } from './iti-examiner-list.component';

describe('ItiExaminerListComponent', () => {
  let component: ItiExaminerListComponent;
  let fixture: ComponentFixture<ItiExaminerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiExaminerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiExaminerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
