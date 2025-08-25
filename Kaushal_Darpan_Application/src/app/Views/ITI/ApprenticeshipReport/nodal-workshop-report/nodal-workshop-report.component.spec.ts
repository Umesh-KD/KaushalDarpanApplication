import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalWorkshopReportComponent } from './nodal-workshop-report.component';

describe('NodalWorkshopReportComponent', () => {
  let component: NodalWorkshopReportComponent;
  let fixture: ComponentFixture<NodalWorkshopReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodalWorkshopReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalWorkshopReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
