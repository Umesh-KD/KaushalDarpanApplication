import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwappingReportComponent } from './swapping-report.component';

describe('SwappingReportComponent', () => {
  let component: SwappingReportComponent;
  let fixture: ComponentFixture<SwappingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SwappingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwappingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
