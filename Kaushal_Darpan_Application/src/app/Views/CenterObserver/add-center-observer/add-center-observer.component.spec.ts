import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCenterObserverComponent } from './add-center-observer.component';

describe('AddCenterObserverComponent', () => {
  let component: AddCenterObserverComponent;
  let fixture: ComponentFixture<AddCenterObserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCenterObserverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCenterObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
