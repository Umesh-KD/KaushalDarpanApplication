import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrevianceMappingComponent } from './greviance-mapping.component';

describe('GrevianceMappingComponent', () => {
  let component: GrevianceMappingComponent;
  let fixture: ComponentFixture<GrevianceMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrevianceMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrevianceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
