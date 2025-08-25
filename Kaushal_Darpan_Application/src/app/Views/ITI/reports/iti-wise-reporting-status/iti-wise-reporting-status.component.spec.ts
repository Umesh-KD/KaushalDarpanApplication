import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportingStatusComponent } from './iti-wise-reporting-status.component';

describe('ReportingStatusComponent', () => {
  let component: ReportingStatusComponent;
  let fixture: ComponentFixture<ReportingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportingStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
