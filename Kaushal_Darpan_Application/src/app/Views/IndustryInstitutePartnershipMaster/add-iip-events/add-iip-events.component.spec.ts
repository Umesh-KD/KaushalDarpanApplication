import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIIPEventsComponent } from './add-iip-events.component';

describe('AddIIPEventsComponent', () => {
  let component: AddIIPEventsComponent;
  let fixture: ComponentFixture<AddIIPEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIIPEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIIPEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
