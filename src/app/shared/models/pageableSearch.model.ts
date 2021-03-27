export class PageableSearch<T> {

  public currentPage: number;
  public totalItems: number;
  public totalReturned: number;
  public totalPages: number;
  public items: T[];
}
