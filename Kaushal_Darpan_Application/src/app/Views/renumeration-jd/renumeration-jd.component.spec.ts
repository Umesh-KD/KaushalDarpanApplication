import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerationJdComponent } from './renumeration-jd.component';

describe('RenumerationJdComponent', () => {
  let component: RenumerationJdComponent;
  let fixture: ComponentFixture<RenumerationJdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenumerationJdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenumerationJdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
