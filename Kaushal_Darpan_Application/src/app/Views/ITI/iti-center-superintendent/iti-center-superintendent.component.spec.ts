import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCenterSuperintendentComponent } from './iti-center-superintendent.component';

describe('ItiCenterSuperintendentComponent', () => {
  let component: ItiCenterSuperintendentComponent;
  let fixture: ComponentFixture<ItiCenterSuperintendentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCenterSuperintendentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCenterSuperintendentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
