import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiExamCoordinatorComponent } from './iti-exam-coordinator.component';

describe('ItiExamCoordinatorComponent', () => {
  let component: ItiExamCoordinatorComponent;
  let fixture: ComponentFixture<ItiExamCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiExamCoordinatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiExamCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
