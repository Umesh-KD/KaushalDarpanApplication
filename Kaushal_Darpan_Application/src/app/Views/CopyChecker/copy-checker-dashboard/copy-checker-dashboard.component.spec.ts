import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyCheckerDashboardComponent } from './copy-checker-dashboard.component';

describe('CopyCheckerDashboardComponent', () => {
  let component: CopyCheckerDashboardComponent;
  let fixture: ComponentFixture<CopyCheckerDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyCheckerDashboardComponent]
    });
    fixture = TestBed.createComponent(CopyCheckerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
