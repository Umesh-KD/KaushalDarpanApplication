import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPrivateAddEstablishComponent } from './ITI_Private_AddEstablish.component';

describe('ITIPrivateAddEstablishComponent', () => {
  let component: ITIPrivateAddEstablishComponent;
  let fixture: ComponentFixture<ITIPrivateAddEstablishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIPrivateAddEstablishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPrivateAddEstablishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
