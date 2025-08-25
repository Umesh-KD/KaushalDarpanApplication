import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCenterAllotmentComponent } from './iti-center-allotment.component';

describe('ItiCenterAllotmentComponent', () => {
  let component: ItiCenterAllotmentComponent;
  let fixture: ComponentFixture<ItiCenterAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCenterAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCenterAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
