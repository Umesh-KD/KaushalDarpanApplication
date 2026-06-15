import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleIIPDetailsComponent } from './single-iip-details.component';

describe('SinglePostComponent', () => {
  let component: SingleIIPDetailsComponent;
  let fixture: ComponentFixture<SingleIIPDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleIIPDetailsComponent]
    });
    fixture = TestBed.createComponent(SingleIIPDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
