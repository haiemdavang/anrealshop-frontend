import { ActionIcon, Group, Skeleton, Text, Title } from '@mantine/core';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiPackage } from 'react-icons/fi';
import { useGetProduct } from '../../../hooks/useProduct';
import type { UserProductDto } from '../../../types/ProductType';
import ProductCard from '../Common/ProductCard';

interface ProductListSuggestProps {
  categoryPath?: string;
  currentProductId: string;
}

interface ProductRequest {
  key: string;
  promise: Promise<UserProductDto[]>;
}

const ProductListSuggest = ({
  categoryPath,
  currentProductId,
}: ProductListSuggestProps) => {
  const [products, setProducts] = useState<UserProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const requestRef = useRef<ProductRequest | null>(null);
  const { getListRecommended } = useGetProduct();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    slidesToScroll: 1,
  });

  useEffect(() => {
    if (!categoryPath) {
      setProducts([]);
      return;
    }

    const requestKey = `${currentProductId}:${categoryPath}`;
    let request = requestRef.current;

    if (!request || request.key !== requestKey) {
      request = {
        key: requestKey,
        promise: getListRecommended({
          page: 0,
          // Lấy dư một bản ghi để loại sản phẩm đang xem nhưng vẫn giữ tối đa 6 gợi ý.
          limit: 7,
          categoryId: categoryPath,
        }),
      };
      requestRef.current = request;
    }

    let active = true;
    setLoading(true);

    request.promise
      .then((data) => {
        if (!active) return;

        setProducts(
          data
            .filter((item) => item.id !== currentProductId)
            .slice(0, 6)
        );
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [categoryPath, currentProductId, getListRecommended]);

  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', updateScrollButtons);
    emblaApi.on('reInit', updateScrollButtons);
    updateScrollButtons();

    return () => {
      emblaApi.off('select', updateScrollButtons);
      emblaApi.off('reInit', updateScrollButtons);
    };
  }, [emblaApi, updateScrollButtons]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0);
    updateScrollButtons();
  }, [emblaApi, products, updateScrollButtons]);

  if (!categoryPath) return null;

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <Group justify="space-between" align="center" mb="lg">
        <div>
          <Title order={2} className="!text-2xl !font-bold">
            Sản phẩm tương tự
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Khám phá thêm sản phẩm trong cùng danh mục
          </Text>
        </div>

        {!loading && products.length > 0 && (
          <Group gap="xs">
            <ActionIcon
              variant="default"
              radius="xl"
              size="lg"
              disabled={!canScrollPrev}
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Xem sản phẩm trước"
            >
              <FiChevronLeft size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              radius="xl"
              size="lg"
              disabled={!canScrollNext}
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Xem sản phẩm tiếp theo"
            >
              <FiChevronRight size={20} />
            </ActionIcon>
          </Group>
        )}
      </Group>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <Skeleton height={250} radius="lg" />
              <Skeleton height={14} mt="sm" />
              <Skeleton height={14} mt="xs" width="65%" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-3 flex">
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-0 flex-[0_0_50%] pl-3 sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 py-10 text-center">
          <FiPackage size={36} className="mx-auto mb-3 text-gray-400" />
          <Text c="dimmed">Chưa có sản phẩm tương tự trong danh mục này</Text>
        </div>
      )}
    </section>
  );
};

export default ProductListSuggest;
