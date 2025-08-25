import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMCAllocationListComponent } from './imc-allocation-list.component';

describe('IMCAllocationListComponent', () => {
  let component: IMCAllocationListComponent;
  let fixture: ComponentFixture<IMCAllocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IMCAllocationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IMCAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
