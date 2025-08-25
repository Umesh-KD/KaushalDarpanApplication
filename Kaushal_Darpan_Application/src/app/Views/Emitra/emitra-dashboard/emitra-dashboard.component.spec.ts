import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitraDashboardComponent } from './emitra-dashboard.component';

describe('EmitraDashboardComponent', () => {
  let component: EmitraDashboardComponent;
  let fixture: ComponentFixture<EmitraDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmitraDashboardComponent]
    });
    fixture = TestBed.createComponent(EmitraDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
