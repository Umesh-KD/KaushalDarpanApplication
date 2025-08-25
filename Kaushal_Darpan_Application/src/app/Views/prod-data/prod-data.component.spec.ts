import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdDataComponent } from './prod-data.component';

describe('ITISearchComponent', () => {
  let component: ProdDataComponent;
  let fixture: ComponentFixture<ProdDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
