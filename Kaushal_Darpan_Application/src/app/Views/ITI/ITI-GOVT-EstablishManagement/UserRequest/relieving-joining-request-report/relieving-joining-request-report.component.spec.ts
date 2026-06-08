import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelievingJoiningRequestReportComponent } from './relieving-joining-request-report.component';

describe('RelievingJoiningRequestReportComponent', () => {
  let component: RelievingJoiningRequestReportComponent;
  let fixture: ComponentFixture<RelievingJoiningRequestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelievingJoiningRequestReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelievingJoiningRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
