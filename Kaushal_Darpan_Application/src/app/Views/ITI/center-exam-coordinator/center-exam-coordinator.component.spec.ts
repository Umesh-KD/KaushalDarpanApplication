import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterExamCoordinatorComponent } from './center-exam-coordinator.component';

describe('CenterExamCoordinatorComponent', () => {
  let component: CenterExamCoordinatorComponent;
  let fixture: ComponentFixture<CenterExamCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterExamCoordinatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterExamCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
