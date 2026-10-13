import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiLeaveCreditComponent } from './iti-leave-credit.component';

describe('ItiLeaveCreditComponent', () => {
  let component: ItiLeaveCreditComponent;
  let fixture: ComponentFixture<ItiLeaveCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiLeaveCreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiLeaveCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
