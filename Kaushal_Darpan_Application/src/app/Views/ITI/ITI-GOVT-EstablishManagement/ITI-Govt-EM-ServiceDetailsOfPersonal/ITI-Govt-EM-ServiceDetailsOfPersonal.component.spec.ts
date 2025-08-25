import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMServiceDetailsOfPersonalComponent } from './ITI-Govt-EM-ServiceDetailsOfPersonal.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: ITIGovtEMServiceDetailsOfPersonalComponent;
  let fixture: ComponentFixture<ITIGovtEMServiceDetailsOfPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMServiceDetailsOfPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMServiceDetailsOfPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
