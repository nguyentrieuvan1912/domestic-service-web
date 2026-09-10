export interface BlogPost {
  id: string
  slug: string
  title: string
  category: 'CLEANING_TIPS' | 'FAMILY_KNOWLEDGE'
  date: string
  excerpt: string
  imageUrl: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-01',
    slug: 'giu-nha-cua-gon-gang-moi-ngay',
    title: '5 thói quen nhỏ giúp nhà cửa luôn gọn gàng mỗi ngày',
    category: 'CLEANING_TIPS',
    date: '2026-08-20',
    excerpt: 'Một vài thay đổi đơn giản trong nhịp sinh hoạt có thể giúp bạn tiết kiệm nhiều thời gian dọn dẹp.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'blog-02',
    slug: 'don-dep-nha-truoc-khi-co-khach',
    title: 'Checklist dọn dẹp nhanh trước khi đón khách',
    category: 'CLEANING_TIPS',
    date: '2026-08-12',
    excerpt: 'Ưu tiên đúng khu vực và thao tác theo thứ tự để không gian sẵn sàng mà không bị quá tải.',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'blog-03',
    slug: 'khong-gian-song-va-suc-khoe-tinh-than',
    title: 'Không gian sống ảnh hưởng đến sức khỏe tinh thần như thế nào?',
    category: 'FAMILY_KNOWLEDGE',
    date: '2026-07-28',
    excerpt: 'Một môi trường sạch và có tổ chức giúp gia đình cảm thấy thư thái hơn trong những ngày bận rộn.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'blog-04',
    slug: 'chon-lich-don-dep-phu-hop',
    title: 'Chọn lịch dọn dẹp phù hợp với nhịp sống gia đình',
    category: 'FAMILY_KNOWLEDGE',
    date: '2026-07-15',
    excerpt: 'Từ dọn theo ca đến lịch định kỳ, hãy bắt đầu bằng nhu cầu thật của gia đình bạn.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85',
  },
]

export const blogCategoryLabels: Record<BlogPost['category'], string> = {
  CLEANING_TIPS: 'Mẹo dọn dẹp',
  FAMILY_KNOWLEDGE: 'Kiến thức gia đình',
}
