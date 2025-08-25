import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPendingFeesComponent } from './itipending-fees.component';

describe('ITIPendingFeesComponent', () => {
  let component: ITIPendingFeesComponent;
  let fixture: ComponentFixture<ITIPendingFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIPendingFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPendingFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
