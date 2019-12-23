import {Bookmark} from '@app/shared/models/bookmark';
import {View} from '@app/shared/models/view';
import {Like} from '@app/shared/models/like';

export interface UserActivities {
    uid                  : string;
    views?               : Array<View>;
    likes?               : Array<Like>;
    bookmarks?           : Array<Bookmark>;
}