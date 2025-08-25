import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalDispatchRevalGroupComponent } from './principal-dispatch-reval-group.component';

describe('PrincipalDispatchGroupComponent', () => {
  let component: PrincipalDispatchRevalGroupComponent;
  let fixture: ComponentFixture<PrincipalDispatchRevalGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipalDispatchRevalGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalDispatchRevalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
