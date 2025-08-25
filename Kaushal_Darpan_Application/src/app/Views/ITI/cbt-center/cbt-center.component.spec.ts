import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cbtcenterComponent } from './cbt-center.component';

describe('ITITimeTableComponent', () => {
  let component: cbtcenterComponent;
  let fixture: ComponentFixture<cbtcenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [cbtcenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(cbtcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
