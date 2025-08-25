import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPrincipalRevalGroupCodeListComponent } from './DispatchPrincipalRevalGroupCode-list.component';

describe('DispatchPrincipalGroupCodeListComponent', () => {
  let component: DispatchPrincipalRevalGroupCodeListComponent;
  let fixture: ComponentFixture<DispatchPrincipalRevalGroupCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatchPrincipalRevalGroupCodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchPrincipalRevalGroupCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
