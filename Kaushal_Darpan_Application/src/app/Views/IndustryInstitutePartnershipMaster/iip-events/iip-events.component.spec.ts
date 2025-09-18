import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IIPEventsComponent } from './iip-events.component';

describe('IIPEventsComponent', () => {
  let component: IIPEventsComponent;
  let fixture: ComponentFixture<IIPEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IIPEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IIPEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
