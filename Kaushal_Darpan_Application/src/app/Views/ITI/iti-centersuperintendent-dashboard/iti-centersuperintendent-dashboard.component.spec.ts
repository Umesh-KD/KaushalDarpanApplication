import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCentersuperintendentDashboardComponent } from './iti-centersuperintendent-dashboard.component';

describe('ItiCentersuperintendentDashboardComponent', () => {
  let component: ItiCentersuperintendentDashboardComponent;
  let fixture: ComponentFixture<ItiCentersuperintendentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCentersuperintendentDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCentersuperintendentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
