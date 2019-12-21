
export interface UserActivities {
    uid                  : string;
    activityId           : string;
    views?               : Array<string>;
    likes?               : Array<string>;
    bookmarks?           : Array<string>;
}