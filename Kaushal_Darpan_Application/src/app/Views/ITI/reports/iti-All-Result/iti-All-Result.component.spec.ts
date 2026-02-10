import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiAllResultComponent } from './iti-All-Result.component';

describe('ITITimeTableComponent', () => {
  let component: itiAllResultComponent;
  let fixture: ComponentFixture<itiAllResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [itiAllResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiAllResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
