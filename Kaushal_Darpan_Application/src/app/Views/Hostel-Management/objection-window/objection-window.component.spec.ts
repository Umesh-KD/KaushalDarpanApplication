import { ComponentFixture, TestBed } from '@angular/core/testing';

import { objectionwindowComponent } from './objection-window.component';

describe('StudentRequestListComponent', () => {
  let component: objectionwindowComponent;
  let fixture: ComponentFixture<objectionwindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [objectionwindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(objectionwindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
