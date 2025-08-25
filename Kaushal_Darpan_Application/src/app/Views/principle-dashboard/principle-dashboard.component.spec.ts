import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipleDashboardComponent } from './principle-dashboard.component';

describe('PrincipleDashboardComponent', () => {
  let component: PrincipleDashboardComponent;
  let fixture: ComponentFixture<PrincipleDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrincipleDashboardComponent]
    });
    fixture = TestBed.createComponent(PrincipleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
