import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalListComponent } from './nodal-list.component';

describe('NodalListComponent', () => {
  let component: NodalListComponent;
  let fixture: ComponentFixture<NodalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodalListComponent]
    });
    fixture = TestBed.createComponent(NodalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
