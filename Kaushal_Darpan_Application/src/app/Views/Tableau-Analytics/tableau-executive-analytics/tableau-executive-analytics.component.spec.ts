import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauExecutiveAnalyticsComponent } from './tableau-executive-analytics.component';

describe('TableauExecutiveAnalyticsComponent', () => {
  let component: TableauExecutiveAnalyticsComponent;
  let fixture: ComponentFixture<TableauExecutiveAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauExecutiveAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauExecutiveAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
