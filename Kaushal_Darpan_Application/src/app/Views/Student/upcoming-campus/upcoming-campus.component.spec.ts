import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingCampusComponent } from './upcoming-campus.component';

describe('UpcomingCampusComponent', () => {
  let component: UpcomingCampusComponent;
  let fixture: ComponentFixture<UpcomingCampusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingCampusComponent]
    });
    fixture = TestBed.createComponent(UpcomingCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
