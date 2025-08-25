import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIAddcompanydispatchComponent } from './iti-addcompanydispatch.component';

describe('ITIAddcompanydispatchComponent', () => {
  let component: ITIAddcompanydispatchComponent;
  let fixture: ComponentFixture<ITIAddcompanydispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIAddcompanydispatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIAddcompanydispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
