import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiCenterObserverComponent } from './add-iti-flying-squad.component';

describe('AddItiCenterObserverComponent', () => {
  let component: AddItiCenterObserverComponent;
  let fixture: ComponentFixture<AddItiCenterObserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItiCenterObserverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItiCenterObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
