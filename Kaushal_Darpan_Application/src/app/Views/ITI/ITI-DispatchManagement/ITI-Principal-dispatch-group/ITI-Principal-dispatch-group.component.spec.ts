import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPrincipalDispatchGroupComponent } from './ITI-Principal-dispatch-group.component';

describe('PrincipalDispatchGroupComponent', () => {
  let component: ITIPrincipalDispatchGroupComponent;
  let fixture: ComponentFixture<ITIPrincipalDispatchGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIPrincipalDispatchGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPrincipalDispatchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
