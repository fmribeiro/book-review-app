import { Book } from './book.model';
import { Review } from './review.model';

export class User {

  id: string;
  name: string;
  nickname: string;
  idToken: string;
  booksRead?: string;
  reviewsDone?: string;
  users?: string;
  books?: Book[];
  reviews?: Review[];
  usersFollowing?: User[];
  following?: string[];
  isFollowingUser?: boolean;

}
