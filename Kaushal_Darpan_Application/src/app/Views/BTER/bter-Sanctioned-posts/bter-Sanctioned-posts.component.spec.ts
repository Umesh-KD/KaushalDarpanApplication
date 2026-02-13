import { ComponentFixture, TestBed } from '@angular/core/testing';

import { bterSanctionedPostsComponent } from './bter-Sanctioned-posts.component';

describe('bterSanctionedPostsComponent', () => {
  let component: bterSanctionedPostsComponent;
  let fixture: ComponentFixture<bterSanctionedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [bterSanctionedPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(bterSanctionedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
