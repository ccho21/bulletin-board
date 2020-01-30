import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WgtBookmarkComponent } from './wgt-bookmark.component';

describe('WgtBookmarkComponent', () => {
  let component: WgtBookmarkComponent;
  let fixture: ComponentFixture<WgtBookmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WgtBookmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WgtBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
