import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IipDashboardComponent } from './iip-dashboard.component';

describe('IipDashboardComponent', () => {
  let component: IipDashboardComponent;
  let fixture: ComponentFixture<IipDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IipDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IipDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
