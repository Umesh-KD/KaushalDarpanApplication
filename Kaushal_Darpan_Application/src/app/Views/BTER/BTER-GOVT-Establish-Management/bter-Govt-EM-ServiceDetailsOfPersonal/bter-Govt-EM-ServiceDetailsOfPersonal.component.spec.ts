import { ComponentFixture, TestBed } from '@angular/core/testing';

import { bterGovtEMServiceDetailsOfPersonalComponent } from './bter-Govt-EM-ServiceDetailsOfPersonal.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: bterGovtEMServiceDetailsOfPersonalComponent;
  let fixture: ComponentFixture<bterGovtEMServiceDetailsOfPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [bterGovtEMServiceDetailsOfPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(bterGovtEMServiceDetailsOfPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
