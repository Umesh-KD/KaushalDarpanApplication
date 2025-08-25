import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSuperintendentListComponent } from './DispatchSuperintendentList.component';

describe('QualificationFormComponent', () => {
  let component: DispatchSuperintendentListComponent;
  let fixture: ComponentFixture<DispatchSuperintendentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchSuperintendentListComponent]
    });
    fixture = TestBed.createComponent(DispatchSuperintendentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
