import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedApplicationsComponent } from './assigned-applications.component';

describe('AssignedApplicationsComponent', () => {
  let component: AssignedApplicationsComponent;
  let fixture: ComponentFixture<AssignedApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedApplicationsComponent]
    });
    fixture = TestBed.createComponent(AssignedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
