import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiPromoteStudentComponent } from './iti-promote-student.component';

describe('ItiPromoteStudentComponent', () => {
  let component: ItiPromoteStudentComponent;
  let fixture: ComponentFixture<ItiPromoteStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiPromoteStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiPromoteStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
