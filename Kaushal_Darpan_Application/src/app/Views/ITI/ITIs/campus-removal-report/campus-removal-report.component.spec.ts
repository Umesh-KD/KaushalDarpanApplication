import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusRemovalReportComponent } from './campus-removal-report.component';

describe('CampusRemovalReportComponent', () => {
  let component: CampusRemovalReportComponent;
  let fixture: ComponentFixture<CampusRemovalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampusRemovalReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusRemovalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
