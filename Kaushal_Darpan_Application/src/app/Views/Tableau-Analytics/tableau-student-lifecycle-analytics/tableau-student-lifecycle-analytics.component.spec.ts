import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauStudentLifecycleAnalyticsComponent } from './tableau-student-lifecycle-analytics.component';

describe('TableauStudentLifecycleAnalyticsComponent', () => {
  let component: TableauStudentLifecycleAnalyticsComponent;
  let fixture: ComponentFixture<TableauStudentLifecycleAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauStudentLifecycleAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauStudentLifecycleAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
