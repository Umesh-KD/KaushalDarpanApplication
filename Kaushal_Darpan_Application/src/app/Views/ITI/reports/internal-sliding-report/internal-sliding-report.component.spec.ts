import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalSlidingReportComponent } from './internal-sliding-report.component';

describe('InternalSlidingReportComponent', () => {
  let component: InternalSlidingReportComponent;
  let fixture: ComponentFixture<InternalSlidingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalSlidingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalSlidingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
