import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPrincipalGroupCodeListComponent } from './DispatchPrincipalGroupCode-list.component';

describe('DispatchPrincipalGroupCodeListComponent', () => {
  let component: DispatchPrincipalGroupCodeListComponent;
  let fixture: ComponentFixture<DispatchPrincipalGroupCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatchPrincipalGroupCodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchPrincipalGroupCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
