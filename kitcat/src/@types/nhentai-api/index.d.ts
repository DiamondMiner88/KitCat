// A few hours spent on this, great use of my time
/// <reference types="node" />

declare module 'nhentai-api' {
  import http from 'http';
  import https from 'https';

  type APIArgs = object;
  type APISearch = object;

  class APIPath {
    static search(query: string, page?: number): string;
    static searchTagged(tagID: number, page?: number): string;
    static searchAlike(bookID: number): string;

    static book(bookID: number): string;
    static bookCover(mediaID: number, extention: string): string;
    static bookPage(mediaID: number, page: number, extention: string): string;
    static bookThumb(mediaID: number, page: number, extention: string): string;
  }

  type httpAgent = object | http.Agent | https.Agent;

  type nHentaiHosts = {
    api: '' | string;
    images: '' | string;
    thumbs: '' | string;
  };

  type nHentaiOptions = {
    hosts?: nHentaiHosts;
    ssl?: boolean;
    httpAgent?: boolean;
  };

  export class API {
    static APIPath: APIPath;

    constructor(options?: object);

    get net(): typeof http | typeof https;

    request(options: { host: string; path: string }): Promise<object>; // make this more clear

    getApiArgs(hostType: string, api: string): APIArgs;

    search(query: string, page?: number): Promise<Search>;
    searchALike(book: number | Book): Promise<Search>;

    getBook(bookID: number): Promise<Book>;
    getImageUrl(image: Image): string;
    getThumbUrl(image: Image): string;
  }

  export class Search {
    page: number;
    perPage: number;
    books: Book[];
    pages: number;

    static parse(search: APISearch): Search;

    constructor(params: { page?: number; pages?: number; perPage?: number; books?: Book[] });

    pushBook(book: Book): boolean;
  }

  type APIBook = {
    title?: BookTitle;
    id?: number | string;
    media_id?: number | string;
    num_favorites?: number | string;
    num_pages?: number | string;
    scanlator?: string;
    uploaded?: number | string;
    cover?: APIImage;
    images?: APIImage[];
    tags?: APITag[];
  };
  type BookTitle = {
    english: string;
    pretty: string;
    japanese: string;
  };
  export class Book {
    static Unknown: typeof UnknownBook;
    static UnknownBook: UnknownBook;

    static parse(book: APIBook): Book;

    title: BookTitle;
    id: number;
    media: number;
    favorites: number;
    scanlator: string;
    uploaded: Date;
    tags: Tag[];
    cover: Image;
    pages: Image[];

    get isKnown(): boolean;

    private setCover(cover: Image): boolean;
    private pushPage(page: Image): boolean;
    private pushTag(tag: Tag): boolean;

    hasTag(tag: Tag, strict?: boolean): boolean;
    hasTagWith(tag: Tag): boolean;
  }
  class UnknownBook extends Book {}

  type APIImage = {
    t: string;
    w: number | string;
    h: number | string;
  };
  type ImageTypes = {
    JPEG: TagType;
    PNG: TagType;
  };
  class ImageType {
    static knownTypes: ImageTypes;

    type: null | string;
    extension: null | string;

    constructor(type: string, extension: string);

    get isKnown(): boolean;
  }
  class UnknownImageType extends ImageType {
    constructor(type: string, extension: string);
  }

  export class Image {
    // static types

    static parse(image: APIImage, id?: number): Image;

    id: number;
    width: number;
    height: number;
    type: ImageType;
    book: Book;

    constructor(params: {
      id?: number;
      width?: number;
      height?: number;
      type?: string | ImageType;
      book?: Book;
    });

    get isCover(): boolean;

    get fileName(): string;
  }

  type TagTypes = {
    Unknown: UnknownTagType;
    Tag: TagType;
    Category: TagType;
    Artist: TagType;
    Parody: TagType;
    Character: TagType;
    Group: TagType;
    Language: TagType;
  };
  class TagType {
    static knownTypes: TagTypes;

    type: null | string;

    constructor(type: string);

    get isKnown(): boolean;
  }
  class UnknownTagType extends TagType {
    constructor(type?: string);
  }

  type APITag = {
    id: number | string;
    type: string;
    name: string;
    count: number | string;
    url: string;
  };

  export class Tag {
    static types: TagTypes;
    static known: Omit<TagTypes, 'Unknown'>; // not sure abt this
    static get(type: string): TagType | UnknownTagType;
    static get(tag: APITag | Tag): Tag;

    id: Number;
    type: TagType;
    name: string;
    count: number;
    url: string;

    constructor(params: {
      id?: number;
      type?: string | TagType;
      name?: string;
      count?: number;
      url?: string;
    });

    compare(tag: string | Tag, strict?: boolean): boolean;
  }
}
