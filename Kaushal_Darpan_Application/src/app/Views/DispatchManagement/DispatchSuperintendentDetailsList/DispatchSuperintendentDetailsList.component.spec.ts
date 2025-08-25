import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSuperintendentDetailsListComponent } from './DispatchSuperintendentDetailsList.component';

describe('DispatchSuperintendentDetailsListComponent', () => {
  let component: DispatchSuperintendentDetailsListComponent;
  let fixture: ComponentFixture<DispatchSuperintendentDetailsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchSuperintendentDetailsListComponent]
    });
    fixture = TestBed.createComponent(DispatchSuperintendentDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
