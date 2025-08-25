import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowMenuComponent } from './know-menu.component';

describe('KnowMenuComponent', () => {
  let component: KnowMenuComponent;
  let fixture: ComponentFixture<KnowMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KnowMenuComponent]
    });
    fixture = TestBed.createComponent(KnowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
