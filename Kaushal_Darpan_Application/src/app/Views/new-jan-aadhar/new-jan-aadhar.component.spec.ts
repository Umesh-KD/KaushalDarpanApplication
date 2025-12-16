import { ComponentFixture, TestBed } from '@angular/core/testing';

import {JanAadharDetailComponent } from './new-jan-aadhar.component';

describe('CompanyMasterComponent', () => {
  let component:  JanAadharDetailComponent;
  let fixture: ComponentFixture<JanAadharDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JanAadharDetailComponent]
    });
    fixture = TestBed.createComponent(JanAadharDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
