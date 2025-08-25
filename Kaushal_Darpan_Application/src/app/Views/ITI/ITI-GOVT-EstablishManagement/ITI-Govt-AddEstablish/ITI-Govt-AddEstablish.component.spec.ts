import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtAddEstablishComponent } from './ITI-Govt-AddEstablish.component';

describe('ITIGovtAddEstablishComponent', () => {
  let component: ITIGovtAddEstablishComponent;
  let fixture: ComponentFixture<ITIGovtAddEstablishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtAddEstablishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtAddEstablishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
