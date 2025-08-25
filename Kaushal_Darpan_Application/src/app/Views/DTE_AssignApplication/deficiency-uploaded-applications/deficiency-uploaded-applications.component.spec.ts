import { ComponentFixture, TestBed } from '@angular/core/testing';

import {DeficiencyUploadedApplicationsComponent } from './deficiency-uploaded-applications.component';

describe('DeficiencyUploadedApplicationsComponent', () => {
  let component: DeficiencyUploadedApplicationsComponent;
  let fixture: ComponentFixture<DeficiencyUploadedApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeficiencyUploadedApplicationsComponent]
    });
    fixture = TestBed.createComponent(DeficiencyUploadedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
