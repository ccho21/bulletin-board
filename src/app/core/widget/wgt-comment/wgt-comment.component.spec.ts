import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WgtCommentComponent } from './wgt-comment.component';

describe('WgtCommentComponent', () => {
  let component: WgtCommentComponent;
  let fixture: ComponentFixture<WgtCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WgtCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WgtCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
