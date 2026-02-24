import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalMappingComponent } from './nodal-mapping.component';

describe('NodalMappingComponent', () => {
  let component: NodalMappingComponent;
  let fixture: ComponentFixture<NodalMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodalMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
