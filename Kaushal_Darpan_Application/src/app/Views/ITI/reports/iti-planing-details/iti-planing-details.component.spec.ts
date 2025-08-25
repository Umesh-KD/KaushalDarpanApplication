import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiPlaningDetailsComponent } from './iti-planing-details.component';

describe('ItiPlaningDetails', () => {
  let component: ItiPlaningDetailsComponent;
  let fixture: ComponentFixture<ItiPlaningDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiPlaningDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiPlaningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
