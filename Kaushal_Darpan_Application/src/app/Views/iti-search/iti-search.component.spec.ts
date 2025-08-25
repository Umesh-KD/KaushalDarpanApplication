import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITISearchComponent } from './iti-search.component';

describe('ITISearchComponent', () => {
  let component: ITISearchComponent;
  let fixture: ComponentFixture<ITISearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITISearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITISearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
