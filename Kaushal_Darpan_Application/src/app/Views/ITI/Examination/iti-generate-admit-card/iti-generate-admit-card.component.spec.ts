import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGenerateAdmitCardComponent } from './iti-generate-admit-card.component';

describe('ITIGenerateAdmitCardComponent', () => {
  let component: ITIGenerateAdmitCardComponent;
  let fixture: ComponentFixture<ITIGenerateAdmitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGenerateAdmitCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGenerateAdmitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
