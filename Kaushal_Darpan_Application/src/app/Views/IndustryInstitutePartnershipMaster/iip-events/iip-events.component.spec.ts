import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iipeventsComponent } from './iip-events.component';

describe('IIPEventsComponent', () => {
  let component: iipeventsComponent;
  let fixture: ComponentFixture<iipeventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [iipeventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(iipeventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
