import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauResultAnalyticsComponent } from './tableau-result-analytics.component';

describe('TableauResultAnalyticsComponent', () => {
  let component: TableauResultAnalyticsComponent;
  let fixture: ComponentFixture<TableauResultAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauResultAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauResultAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
