import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDispatchSuperintendentDetailsListComponent } from './ITI-DispatchSuperintendentDetailsList.component';

describe('ITIDispatchSuperintendentDetailsListComponent', () => {
  let component: ITIDispatchSuperintendentDetailsListComponent;
  let fixture: ComponentFixture<ITIDispatchSuperintendentDetailsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIDispatchSuperintendentDetailsListComponent]
    });
    fixture = TestBed.createComponent(ITIDispatchSuperintendentDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
