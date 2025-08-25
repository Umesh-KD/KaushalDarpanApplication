import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPapperSetterComponent } from './itipapper-setter.component';

describe('ITIPapperSetterComponent', () => {
  let component: ITIPapperSetterComponent;
  let fixture: ComponentFixture<ITIPapperSetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIPapperSetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPapperSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
