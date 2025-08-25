import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDispatchSuperintendentListComponent } from './ITI-DispatchSuperintendentList.component';

describe('QualificationFormComponent', () => {
  let component: ITIDispatchSuperintendentListComponent;
  let fixture: ComponentFixture<ITIDispatchSuperintendentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIDispatchSuperintendentListComponent]
    });
    fixture = TestBed.createComponent(ITIDispatchSuperintendentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
