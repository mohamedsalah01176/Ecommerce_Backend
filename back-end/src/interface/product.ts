

export interface IProduct {
  title: Title;
  slug?: Slug;
  description: Slug;
  quantity: Quantity;
  price: Quantity;
  imageCover?: Slug;
  images?: Images;
  category: Slug;
  brand?: Slug;
  ratingsAverage?: RatingsAverage;
  ratingsQuantity?: RatingsQuantity;
  adminId?: AdminId;
  isWachList?: IsWachList;
  createdAt: CreatedAt;
  updatedAt: Slug;
}

interface CreatedAt {
  type: string;
  default: string;
}

interface IsWachList {
  type: string;
  required: boolean;
  default: boolean;
}

interface AdminId {
  type: string;
  required: boolean;
}

interface RatingsQuantity {
  type: string;
  default: number;
}

interface RatingsAverage {
  type: string;
  default: number;
  min: (number | string)[];
  max: (number | string)[];
}

interface Images {
  type: string[];
}

interface Quantity {
  type: string;
  min: (number | string)[];
}

interface Slug {
  type: string;
}

interface Title {
  type: string;
  minlength: (number | string)[];
}