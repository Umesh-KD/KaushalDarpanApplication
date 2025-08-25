import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterDashboardComponent } from './bter-dashboard.component';

describe('BterDashboardComponent', () => {
  let component: BterDashboardComponent;
  let fixture: ComponentFixture<BterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
