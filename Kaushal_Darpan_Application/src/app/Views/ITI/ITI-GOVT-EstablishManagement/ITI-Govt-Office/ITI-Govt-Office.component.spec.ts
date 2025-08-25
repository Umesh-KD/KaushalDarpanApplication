import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtOfficeComponent } from './ITI-Govt-Office.component';

describe('ITIGovtOfficeComponent', () => {
  let component: ITIGovtOfficeComponent;
  let fixture: ComponentFixture<ITIGovtOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIGovtOfficeComponent]
    });
    fixture = TestBed.createComponent(ITIGovtOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
