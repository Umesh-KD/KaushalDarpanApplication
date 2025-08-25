import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCenterObserverComponent } from './iti-center-observer.component';

describe('ItiCenterObserverComponent', () => {
  let component: ItiCenterObserverComponent;
  let fixture: ComponentFixture<ItiCenterObserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiCenterObserverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCenterObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
