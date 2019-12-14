import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { LoggerService } from "@app/core/services/logger/logger.service";
import { of, forkJoin, from, Observable, Observer } from 'rxjs';
import { mergeMap, take, switchMap, concatMap, bufferCount } from 'rxjs/operators';
import { Like } from '@app/shared/models/like';
import { Post } from '@app/shared/models/post';
import { AuthService } from '../auth/auth.service';
import { PostService } from '@app/containers/posts/shared/post.service';
import { Comment } from '@app/shared/models/comment';
import { CommentService } from '@app/containers/posts/post-detail/comments/comment.service';
import { SubComment } from '@app/shared/models/sub-comment';
import { SubCommentService } from '@app/containers/posts/post-detail/comments/sub-comment.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(
    private db: AngularFirestore,
    private logger: LoggerService,
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private subCommentService: SubCommentService
  ) { }
  isLiked(dataId: string, t: number) { // get data from current User Id and match with post id. 
    const query = this.getLikesByData(dataId, t).valueChanges().pipe(mergeMap(res => {
      this.logger.info('is Liked data in like service ', res);
      if (res.length) {
        return of(true);
      }
      else {
        return of(false)
      }
    }));
    return query;
  }

  addLike(dataId: string, like: Like, t: number, dataDTO: Post | Comment | SubComment) {
    const type: string = this.getType(t);
    const likeId = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    likeDTO.likeId = likeId;
    const query = this.db.collection< Post | Comment | SubComment >(type).doc(dataId).collection<Like>('likes').doc(likeId).set(likeDTO);
    return of(query);
  }
  getType(type: number): string {
    return type === 1 ? 'posts' : type === 2 ? 'comments' : 'sub-comments';
  }

  removeLikes(dataId: string, type: number) {
    const likeCollection = this.db.collection<Post>('posts').doc(dataId).collection<Like>('likes');
    const query = this.deleteCollection(likeCollection);
    // return query;
  }

  removeLike(dataId: string, t: number, likeId) {
    const query = this.getLikesByData(dataId, t).valueChanges().pipe(concatMap(res => {
      this.logger.info('### DELETE', res);
      const likeId = res[0].likeId; 
      this.logger.info(likeId);
      return this.db.collection<Like>('likes').doc(likeId).delete().then(res => {
        this.logger.info('good');
      });
    }))
    return query;
  }

  
  getLikesByDataId(dataId: string, type) {
    const q = type === 1 ? 'postId' : type === 2 ? 'commentId' : 'subCommentId';
    this.logger.info('### Q: ', q);
    const query = this.db.collectionGroup<Like>('likes', ref =>
      ref.where(q, '==', dataId).where('type', '==', type));
    return query;
  }

  getLikesByData(dataId: string, t: number) {
    const type = this.getType(t);
    const { uid } = this.authService.getCurrentUser();
    this.logger.info('#### dataID', dataId);
    const query = this.db.collection< Post | Comment | SubComment >(type).doc(dataId)
    .collection('likes', ref => ref.where('user.uid', '==', uid));
    return query;
  }

  // HELPER
  cleanUndefined(dto) {
    const keys = Object.keys(dto);
    keys.forEach(cur => {
      if (!dto[cur]) {
        delete dto[cur];
      }
    })
    return dto;
  }

  getLikesByUid(uid) {
    return this.db
      .collection<Like>('likes', ref =>
        ref.where('user.uid', '==', uid)).valueChanges();
  }

  /**
* Delete all documents in specified collections.
*
* @param {string} collections Collection names
* @return {Promise<number>} Total number of documents deleted (from all collections)
*/
  async deleteCollection(collection: AngularFirestoreCollection<any>): Promise<number> {
    this.logger.info('############ delete collection ###########');
    let totalDeleteCount = 0;
    const batchSize = 500;
    return new Promise<number>((resolve, reject) =>
      from(collection.ref.get())
        .pipe(
          concatMap((q) => from(q.docs)),
          bufferCount(batchSize),
          concatMap((docs: Array<QueryDocumentSnapshot<any>>) => new Observable((o: Observer<number>) => {
            const batch = this.db.firestore.batch();
            docs.forEach((doc) => batch.delete(doc.ref));
            batch.commit()
              .then(() => {
                o.next(docs.length);
                o.complete();
              })
              .catch((e) => o.error(e));
          })),
        )
        .subscribe(
          (batchDeleteCount: number) => totalDeleteCount += batchDeleteCount,
          (e) => reject(e),
          () => resolve(totalDeleteCount),
        ),
    );
  }

}
/*  getLikesByData(dataId: string, type) {
    const { uid } = this.authService.getCurrentUser();
    const q = type === 1 ? 'postId' : type === 2 ? 'commentId' : 'subCommentId';
    const query = this.db.collection('likes', ref =>
      ref.where('type', '==', type).where(q, '==', dataId).where('user.uid', '==', uid));
    return query;
  } */

   /* addLike(dataId: string, like: Like, type: number, dataDTO) {
    this.logger.info('how many times called?');
    const id = this.db.createId();
    const likeDTO = this.cleanUndefined(like);
    likeDTO.likeId = id;

    const query = this.db.collection<Post>('posts').doc(dataId).collection<Like>('likes').doc(id).set(likeDTO);
    return of(query).pipe(
      switchMap(res => {
        if (type === 1) {
          const postDTO: Post = dataDTO;
          postDTO.likes.push(likeDTO);
          this.logger.info('### post DTO ', dataDTO);
          this.postService.updatePost(postDTO.postId, postDTO);
          return of(res);
        }
        else if (type === 2) {
          const commentDTO: Comment = { ...dataDTO };
          commentDTO.likes.push(likeDTO);
          this.logger.info('### Comment DTO', commentDTO);
          this.commentService.updateComment(commentDTO.postId, commentDTO.commentId, commentDTO);
          return of(res);
        }
        else {
          const subCommentDTO: SubComment = { ...dataDTO };
          subCommentDTO.likes.push(likeDTO);
          this.logger.info('### subCommentDTO ', subCommentDTO);
          this.subCommentService.updateSubComment(subCommentDTO.commentId, subCommentDTO);
          return of(res);
        }
      })
    )
  } */

  /* removeLike(dataId: string, type: number, dataDTO) {
    const query = this.getLikesByData(dataId, type).get().pipe(mergeMap(res => res.docs), take(1),
      mergeMap((like: any) => {
        return of(this.db.collection('likes').doc(like.data().likeId).delete()).pipe(
          switchMap(res => {
            if (type === 1) {
              const postDTO: Post = { ...dataDTO };
              const lIndex = postDTO.likes.findIndex(cur => cur === like.likeId);
              postDTO.likes.splice(lIndex, 1);
              this.logger.info('### post DTO to delet', postDTO);
              this.postService.updatePost(postDTO.postId, postDTO);
              return of(res);
            }
            else if (type === 2) {
              const commentDTO: Comment = { ...dataDTO };
              const lIndex = commentDTO.likes.findIndex(cur => cur === like.likeId);
              commentDTO.likes.splice(lIndex, 1);
              this.logger.info('### Comment DTO to delet', commentDTO);
              this.commentService.updateComment(commentDTO.postId, commentDTO.commentId, commentDTO);
              return of(res);
            }
            else {
              const subCommentDTO: SubComment = { ...dataDTO };
              const lIndex = subCommentDTO.likes.findIndex(cur => cur === like.likeId);
              subCommentDTO.likes.splice(lIndex, 1);
              this.logger.info('### subCommentDTO  to delete', subCommentDTO);
              this.subCommentService.updateSubComment(subCommentDTO.commentId, subCommentDTO);
              return of(res);
            }
          })
        )
      }));
    return query;
  } */
