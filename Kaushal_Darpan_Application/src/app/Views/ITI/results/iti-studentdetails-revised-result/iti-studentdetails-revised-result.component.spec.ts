import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIStudentDetailsRevisedResultComponent } from './iti-studentdetails-revised-result.component';

describe('VerifyItiCenterObserverDeploymentComponent', () => {
  let component: ITIStudentDetailsRevisedResultComponent;
  let fixture: ComponentFixture<ITIStudentDetailsRevisedResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIStudentDetailsRevisedResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIStudentDetailsRevisedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
