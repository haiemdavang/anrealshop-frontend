export interface ProductSuggestDto {
  id: string;
  name: string;
  urlSlug: string;
  price: number;
  discountPrice: number;
  thumbnailUrl: string;
  categoryName: string;
}

export interface CategorySuggestDto {
  id: string;
  name: string;
  urlPath: string;
  urlSlug: string;
}

export interface PublicSearchResponse {
  products: ProductSuggestDto[];
  categories: CategorySuggestDto[];
}
