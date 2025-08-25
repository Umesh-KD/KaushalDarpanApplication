import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddITIQuarterReportComponent } from './add-quater-repot.component';

describe('AddITIQuarterReportComponent', () => {
  let component: AddITIQuarterReportComponent;
  let fixture: ComponentFixture<AddITIQuarterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddITIQuarterReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddITIQuarterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
