import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalDispatchGroupComponent } from './principal-dispatch-group.component';

describe('PrincipalDispatchGroupComponent', () => {
  let component: PrincipalDispatchGroupComponent;
  let fixture: ComponentFixture<PrincipalDispatchGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipalDispatchGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalDispatchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
