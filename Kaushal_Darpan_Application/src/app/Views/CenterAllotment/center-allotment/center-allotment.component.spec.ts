import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterAllotmentComponent } from './center-allotment.component';

describe('CenterAllotmentComponent', () => {
  let component: CenterAllotmentComponent;
  let fixture: ComponentFixture<CenterAllotmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterAllotmentComponent]
    });
    fixture = TestBed.createComponent(CenterAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
