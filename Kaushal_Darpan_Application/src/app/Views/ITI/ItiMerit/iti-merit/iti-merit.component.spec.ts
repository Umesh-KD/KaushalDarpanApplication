import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiMeritComponent } from './iti-merit.component';

describe('ItiMeritComponent', () => {
  let component: ItiMeritComponent;
  let fixture: ComponentFixture<ItiMeritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiMeritComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiMeritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
