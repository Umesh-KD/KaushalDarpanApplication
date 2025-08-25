import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipleMenuRightComponent } from './principle-menu-right.component';

describe('PrincipleMenuRightComponent', () => {
  let component: PrincipleMenuRightComponent;
  let fixture: ComponentFixture<PrincipleMenuRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipleMenuRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipleMenuRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
