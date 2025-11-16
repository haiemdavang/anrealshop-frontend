import { Button, Checkbox, Divider, Group, Popover, Radio, RangeSlider, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { FiFilter } from 'react-icons/fi';

interface FilterBarProps {
    totalProducts: number;
    onApplyFilters: (filters: FilterValues) => void;
}

interface FilterValues {
    priceRange: [number, number];
    rating: string;
    brands: string[];
    inStock: boolean;
}

const FilterBar = ({ totalProducts, onApplyFilters }: FilterBarProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const filterBarRef = useRef<HTMLDivElement>(null);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
    const [selectedRating, setSelectedRating] = useState<string>('all');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState(false);

    const brands = [
        { value: 'nike', label: 'Nike' },
        { value: 'adidas', label: 'Adidas' },
        { value: 'puma', label: 'Puma' },
        { value: 'uniqlo', label: 'Uniqlo' },
        { value: 'zara', label: 'Zara' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleFilterClick = () => {
        if (filterBarRef.current) {
            filterBarRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setTimeout(() => {
                open();
            }, 300);
        } else {
            open();
        }
    };

    const handleApply = () => {
        onApplyFilters({
            priceRange,
            rating: selectedRating,
            brands: selectedBrands,
            inStock: inStockOnly
        });
        close();
    };

    const handleReset = () => {
        setPriceRange([0, 5000000]);
        setSelectedRating('all');
        setSelectedBrands([]);
        setInStockOnly(false);
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    return (
        <div
            ref={filterBarRef}
            className={`sticky top-0 z-20 mb-6 rounded-lg shadow-sm py-2 px-4 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white'
                }`}
        >
            <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                    Hiển thị <strong>{totalProducts}</strong> sản phẩm
                </Text>
                <Popover
                    opened={opened}
                    onClose={close}
                    position="bottom-end"
                    width="auto"
                    shadow="xl"
                    offset={10}
                    withArrow
                >
                    <Popover.Target>
                        <Button
                            leftSection={<FiFilter size={16} />}
                            variant="light"
                            size="sm"
                            onClick={handleFilterClick}
                        >
                            Bộ lọc
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown className="p-6 !bg-white/95 backdrop-blur-lg" style={{ minWidth: '900px', maxWidth: '1100px' }}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <Text fw={600} size="lg">
                                    Bộ lọc sản phẩm
                                </Text>
                            </div>

                            {/* Horizontal Layout */}
                            <div className="grid grid-cols-4 gap-6">
                                {/* Price Range */}
                                <div className="col-span-1">
                                    <Text fw={500} size="sm" mb="md">
                                        Khoảng giá
                                    </Text>
                                    <RangeSlider
                                        min={0}
                                        max={5000000}
                                        step={100000}
                                        value={priceRange}
                                        onChange={setPriceRange}
                                        marks={[
                                            { value: 0, label: '0đ' },
                                            { value: 5000000, label: '5tr' },
                                        ]}
                                        mb="xs"
                                    />
                                    <Group justify="space-between" mt="md">
                                        <Text size="xs" c="dimmed">
                                            {formatPrice(priceRange[0])}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {formatPrice(priceRange[1])}
                                        </Text>
                                    </Group>
                                </div>

                                <Divider orientation="vertical" className="h-auto" />

                                {/* Rating Filter */}
                                <div className="col-span-1">
                                    <Text fw={500} size="sm" mb="md">
                                        Đánh giá
                                    </Text>
                                    <Radio.Group value={selectedRating} onChange={setSelectedRating}>
                                        <div className="space-y-2">
                                            <Radio value="all" label="Tất cả" size="sm" />
                                            <Radio value="4" label="Từ 4 sao" size="sm" />
                                            <Radio value="3" label="Từ 3 sao" size="sm" />
                                        </div>
                                    </Radio.Group>
                                </div>

                                <Divider orientation="vertical" className="h-auto" />

                                {/* Brands Filter */}
                                <div className="col-span-1">
                                    <Text fw={500} size="sm" mb="md">
                                        Thương hiệu
                                    </Text>
                                    <Checkbox.Group value={selectedBrands} onChange={setSelectedBrands}>
                                        <div className="space-y-2">
                                            {brands.map((brand) => (
                                                <Checkbox
                                                    key={brand.value}
                                                    value={brand.value}
                                                    label={brand.label}
                                                    size="sm"
                                                />
                                            ))}
                                        </div>
                                    </Checkbox.Group>
                                </div>

                                <Divider orientation="vertical" className="h-auto" />

                                {/* Stock Filter */}
                                <div className="col-span-1">
                                    <Text fw={500} size="sm" mb="md">
                                        Khác
                                    </Text>
                                    <Checkbox
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.currentTarget.checked)}
                                        label="Còn hàng"
                                        size="sm"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons - Horizontal */}
                            <Divider my="md" />
                            <Group justify="space-between" mt="lg">
                                <Button variant="subtle" onClick={handleReset} size="sm">
                                    Xóa bộ lọc
                                </Button>
                                <Group gap="sm">
                                    <Button variant="light" onClick={close} size="sm">
                                        Hủy
                                    </Button>
                                    <Button onClick={handleApply} size="sm">
                                        Áp dụng
                                    </Button>
                                </Group>
                            </Group>
                        </div>
                    </Popover.Dropdown>
                </Popover>
            </Group>
        </div>
    );
};

export default FilterBar;
