import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMZonalOfficeListComponent } from './ITI-Govt-EM-ZonalOfficeList.component';

describe('ITIGovtEMZonalOfficeListComponent', () => {
  let component: ITIGovtEMZonalOfficeListComponent;
  let fixture: ComponentFixture<ITIGovtEMZonalOfficeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMZonalOfficeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMZonalOfficeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
