import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesMasterComponent } from './dtecategories-master.component';

describe('CategoriesMasterComponent', () => {
  let component: CategoriesMasterComponent;
  let fixture: ComponentFixture<CategoriesMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesMasterComponent]
    });
    fixture = TestBed.createComponent(CategoriesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
