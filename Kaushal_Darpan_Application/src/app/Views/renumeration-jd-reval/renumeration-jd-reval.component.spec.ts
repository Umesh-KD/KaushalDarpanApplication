import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerationJdRevalComponent } from './renumeration-jd-reval.component';

describe('RenumerationJdRevalComponent', () => {
  let component: RenumerationJdRevalComponent;
  let fixture: ComponentFixture<RenumerationJdRevalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenumerationJdRevalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenumerationJdRevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
