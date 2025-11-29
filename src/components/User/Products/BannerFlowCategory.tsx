import { motion } from 'framer-motion';

interface BannerData {
    type: 'image' | 'video';
    src: string;
    title: string;
    description: string;
}

interface BannerFlowCategoryProps {
    category: string;
}

const BannerFlowCategory = ({ category }: BannerFlowCategoryProps) => {
    const categoryBanners: Record<string, BannerData> = {
        all: {
            type: 'video',
            src: 'https://image.uniqlo.com/UQ/ST3/jp/imagesother/000_PLP/Casual-Outer/25FW/MEN/KV-m-Video-pc.mp4',
            title: 'Tất cả sản phẩm',
            description: 'Khám phá bộ sưu tập đa dạng của chúng tôi'
        },
        fashion: {
            type: 'image',
            src: 'https://im.uniqlo.com/global-cms/spa/res079bc9b36d900bb2dacb3a052d3d1958fr.jpg',
            title: 'Thời trang',
            description: 'Phong cách mới nhất cho bạn'
        },
    };

    const banner = categoryBanners[category] || categoryBanners.all;

    return (
        <div className="relative h-40 overflow-hidden bg-gray-900 rounded-lg mx-4 mt-4">
            {banner.type === 'video' ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={banner.src} type="video/mp4" />
                </video>
            ) : (
                <img
                    src={banner.src}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            <div className="relative h-full flex items-end px-8 pb-4">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white max-w-2xl"
                >
                    <h1 className="text-2xl font-bold mb-1">{banner.title}</h1>
                    <p className="text-base text-gray-200">{banner.description}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default BannerFlowCategory;
