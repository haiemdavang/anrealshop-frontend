import { Button, Checkbox, Divider, Group, Modal, Radio, RangeSlider, Text } from '@mantine/core';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface FilterModalProps {
    opened: boolean;
    onClose: () => void;
    onApply: (filters: FilterValues) => void;
}

interface FilterValues {
    priceRange: [number, number];
    rating: string;
    brands: string[];
    inStock: boolean;
}

const FilterModal = ({ opened, onClose, onApply }: FilterModalProps) => {
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

    const handleApply = () => {
        onApply({
            priceRange,
            rating: selectedRating,
            brands: selectedBrands,
            inStock: inStockOnly
        });
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
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Text fw={600} size="lg">
                    Bộ lọc sản phẩm
                </Text>
            }
            size="md"
            closeButtonProps={{
                icon: <FiX size={20} />
            }}
        >
            <div className="space-y-6">
                {/* Price Range */}
                <div>
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
                            { value: 2500000, label: '2.5tr' },
                            { value: 5000000, label: '5tr' },
                        ]}
                        mb="xs"
                    />
                    <Group justify="space-between" mt="md">
                        <Text size="sm" c="dimmed">
                            {formatPrice(priceRange[0])}
                        </Text>
                        <Text size="sm" c="dimmed">
                            {formatPrice(priceRange[1])}
                        </Text>
                    </Group>
                </div>

                <Divider />

                {/* Rating Filter */}
                <div>
                    <Text fw={500} size="sm" mb="md">
                        Đánh giá
                    </Text>
                    <Radio.Group value={selectedRating} onChange={setSelectedRating}>
                        <div className="space-y-2">
                            <Radio value="all" label="Tất cả" />
                            <Radio value="4" label="Từ 4 sao trở lên" />
                            <Radio value="3" label="Từ 3 sao trở lên" />
                        </div>
                    </Radio.Group>
                </div>

                <Divider />

                {/* Brands Filter */}
                <div>
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
                                />
                            ))}
                        </div>
                    </Checkbox.Group>
                </div>

                <Divider />

                {/* Stock Filter */}
                <div>
                    <Checkbox
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.currentTarget.checked)}
                        label="Chỉ hiển thị sản phẩm còn hàng"
                    />
                </div>

                {/* Action Buttons */}
                <Group justify="space-between" mt="xl">
                    <Button variant="subtle" onClick={handleReset}>
                        Xóa bộ lọc
                    </Button>
                    <Group gap="xs">
                        <Button variant="light" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button onClick={handleApply}>
                            Áp dụng
                        </Button>
                    </Group>
                </Group>
            </div>
        </Modal>
    );
};

export default FilterModal;
