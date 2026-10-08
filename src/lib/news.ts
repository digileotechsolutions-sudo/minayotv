export type Category = "Kenya" | "Africa" | "World" | "Politics" | "Business" | "Technology" | "Sports" | "Entertainment" | "Lifestyle";

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string[];
  excerpt: string;
  category: Category;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  tags: string[];
  imageCaption?: string;
  source?: string;
  location?: string;
  updatedAt?: string;
  keyTakeaways?: string[];
  isBreaking?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  socialTitle?: string;
  socialDescription?: string;
  featured?: boolean;
  trending?: number;
  status?: "published" | "draft" | "scheduled";
};

export const categories: Category[] = ["Kenya", "Africa", "World", "Politics", "Business", "Technology", "Sports", "Entertainment", "Lifestyle"];

export const articles: Article[] = [
  {
    id: "1", slug: "kenya-reshapes-global-digital-economy", title: "Kenya reshapes the global digital economy through a new innovation corridor", summary: "A generation of founders is turning Nairobi’s creative energy into a globally competitive technology ecosystem.", excerpt: "The capital is becoming a hub for practical technology that reaches far beyond its local market.", category: "Kenya", author: "Amina Otieno", authorRole: "Senior Business Correspondent", date: "2026-10-06T08:30:00", readTime: "7 min read", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=85", imageAlt: "A collaborative team working around a table", tags: ["Kenya", "Technology", "Startups"], featured: true, trending: 1, status: "published",
    content: ["Nairobi’s technology scene is moving from a story about startup culture into a durable economic engine. The city’s most ambitious founders are building products for markets that need practical solutions, not another abstract platform.", "The new corridor brings together universities, venture studios, and corporate innovation teams. The result is a more connected pipeline between early ideas and the capital needed to turn them into scale.", "For the teams involved, the opportunity is not simply to launch products. It is to establish Kenya as a place where technology is designed for real-world infrastructure, agriculture, finance, and public services.", "The policy response is also changing. A new focus on digital skills, startup-friendly regulation, and access to patient capital is helping founders build locally and expand globally."]
  },
  {
    id: "2", slug: "africa-archive-of-rare-ecosystems", title: "A new archive is preserving Africa’s rare ecosystems before they disappear", summary: "Researchers are combining community knowledge with satellite data to create a living record of critical landscapes.", excerpt: "The project is designed to protect both biodiversity and the communities that depend on these habitats.", category: "Africa", author: "Daniel Mwangi", authorRole: "Climate & Environment Editor", date: "2026-10-06T07:00:00", readTime: "5 min read", image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=85", imageAlt: "Sunlight filtering through a dense green forest", tags: ["Africa", "Environment", "Conservation"], featured: true, trending: 2, status: "published",
    content: ["Across the continent, community-led scientists are building an archive that captures the climates, languages, and local knowledge around the world’s most vulnerable ecosystems.", "The archive is designed to be living rather than static. New observations are added as communities notice changes, while satellite imagery offers a wider view of the landscape.", "For researchers, the project offers a new way to connect field knowledge with measurable data. For local communities, it creates a visible record of the places and traditions that are often overlooked."]
  },
  {
    id: "3", slug: "worlds-most-seamless-summer-commute", title: "The world’s most seamless summer commute begins with one bold idea", summary: "A new regional rail service is rethinking how cities move during the busiest season of the year.", excerpt: "The new timetable uses real-time demand data to help hundreds of thousands of passengers arrive on time.", category: "World", author: "Sofia Laurent", authorRole: "Global Affairs Correspondent", date: "2026-10-05T19:00:00", readTime: "6 min read", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=85", imageAlt: "A modern train station at dusk", tags: ["World", "Transport", "Cities"], featured: true, trending: 3, status: "published",
    content: ["The idea is simple: instead of forcing the network to adapt to every new demand, the service is adapting to the people using it. Real-time information helps operators adjust routes before congestion forms.", "The pilot is already reducing average delays and giving passengers more reliable options. Its lessons could travel well beyond the island city where it began."]
  },
  {
    id: "4", slug: "the-politics-behind-quiet-urban-rebirth", title: "The politics behind a quiet urban rebirth", summary: "Local leaders are reshaping public spaces without losing the communities that made them iconic.", excerpt: "A new city plan places public life above traffic and developers’ priorities.", category: "Politics", author: "Noah Bensley", authorRole: "Public Policy Reporter", date: "2026-10-05T16:10:00", readTime: "8 min read", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85", imageAlt: "A city skyline in warm evening light", tags: ["Politics", "Cities", "Governance"], trending: 4, status: "published",
    content: ["The city’s new planning framework is putting people, rather than property values, at the centre of public development. It has already changed how streets, parks, and public buildings are planned.", "The approach is deliberately slow. Leaders are working with residents, local businesses, and community groups to create a city that feel inclusive rather than simply renovated."]
  },
  {
    id: "5", slug: "market-returns-to-the-quiet-innovators", title: "The market returns to the quiet innovators", summary: "Investors are looking beyond the usual technology names for resilient growth.", excerpt: "Smaller, profitable businesses are attracting attention from a new generation of investors.", category: "Business", author: "Elena Karanja", authorRole: "Financial Editor", date: "2026-10-05T13:30:00", readTime: "4 min read", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85", imageAlt: "Business leaders discussing a strategy", tags: ["Business", "Markets", "Investors"], trending: 5, status: "published",
    content: ["A shift in investor expectations is creating room for businesses with durable operations and clear social value. In the new environment, the most attractive companies are not always the fastest-growing.", "The strongest fundamentals are coming from established industries that are using technology to become more efficient, accessible, and resilient."]
  },
  {
    id: "6", slug: "designing-technology-for-a-human-future", title: "Designing technology for a more human future", summary: "The next wave of digital tools is being shaped by the people who use them every day.", excerpt: "A new generation of designers is making accessibility and dignity part of the core brief.", category: "Technology", author: "Marcus Osei", authorRole: "Technology Reporter", date: "2026-10-05T10:15:00", readTime: "6 min read", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85", imageAlt: "Computer screens showing modern digital products", tags: ["Technology", "Design", "AI"], status: "published",
    content: ["The most meaningful products are increasingly designed around care, accessibility, and human attention. Their teams are asking not only what technology can do, but what it can change for the better.", "That shift is visible in the design process: fewer prototypes built around novelty and more around lasting value."]
  },
  {
    id: "7", slug: "champions-write-a-new-era-of-sport", title: "Champions write a new era of sport", summary: "A new generation of athletes is changing the culture around competition and leadership.", excerpt: "Their impact extends far beyond trophies, with players building communities around the game.", category: "Sports", author: "Tariq Muthoni", authorRole: "Sports Correspondent", date: "2026-10-04T21:00:00", readTime: "5 min read", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85", imageAlt: "A stadium filled with spectators", tags: ["Sports", "Champions", "Culture"], status: "published",
    content: ["The athletes’ influence is broadening the conversation around competition. They are building new communities, creating opportunities for younger players, and making the sport more welcoming.", "Their leadership style is fundamentally different from the old model. It values transparency, collaboration, and long-term impact."]
  },
  {
    id: "8", slug: "the-sound-that-is-changing-africas-nightlife", title: "The sound that is changing Africa’s nightlife", summary: "Independent artists are blending local traditions with global production to create a distinct new sound.", excerpt: "The result is a music scene that feels both deeply rooted and unmistakably contemporary.", category: "Entertainment", author: "Lina Kabu", authorRole: "Culture Editor", date: "2026-10-04T18:45:00", readTime: "4 min read", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85", imageAlt: "A performer on stage with lights", tags: ["Entertainment", "Music", "Africa"], status: "published",
    content: ["The new sound is being built through collaboration between artists, producers, and audiences. It draws from local rhythms, spoken word, and modern electronic music.", "The movement is also creating new routes for independent artists to build sustainable careers without relying on traditional gatekeepers."]
  },
  {
    id: "9", slug: "slow-living-returns-to-the-city", title: "Slow living returns to the city", summary: "A growing movement is making space for rest, community, and intentional routines in busy urban life.", excerpt: "New neighbourhood spaces are helping people reconnect with quieter forms of wellbeing.", category: "Lifestyle", author: "Michael Wekesa", authorRole: "Lifestyle Editor", date: "2026-10-04T12:20:00", readTime: "3 min read", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85", imageAlt: "A peaceful natural landscape", tags: ["Lifestyle", "Wellbeing", "Community"], status: "published",
    content: ["In crowded urban neighbourhoods, people are creating small spaces for reflection and connection. These places are not about escaping the city, but changing how people experience it.", "The movement combines local rituals, public spaces, and practical routines that help communities build a more balanced everyday life."]
  },
  {
    id: "10", slug: "nairobi-lights-up-the-small-businesses", title: "Nairobi lights up the small businesses behind the city’s next chapter", summary: "New public spaces are giving independent businesses room to grow and connect with local customers.", excerpt: "A city-led programme is putting neighbourhood businesses at the centre of its economic renewal.", category: "Kenya", author: "Amina Otieno", authorRole: "Senior Business Correspondent", date: "2026-10-04T09:00:00", readTime: "5 min read", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85", imageAlt: "A small shopkeeper in a neighbourhood market", tags: ["Kenya", "Business", "Small Business"], status: "published",
    content: ["Architects and business leaders are working together to create public spaces where neighbourhood traders can grow. The programme is designed around long-term relationships rather than one-off events.", "The impact can be seen in the number of businesses that now have access to new audiences, training, and opportunities to trade beyond their immediate area."]
  },
  {
    id: "11", slug: "africa-builds-the-next-global-energy-map", title: "Africa builds the next global energy map", summary: "New regional partnerships are changing how the continent approaches energy security.", excerpt: "The plan combines local production, storage, and distributed power systems.", category: "Africa", author: "Daniel Mwangi", authorRole: "Climate & Environment Editor", date: "2026-10-03T17:30:00", readTime: "7 min read", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85", imageAlt: "Wind turbines in a green landscape", tags: ["Africa", "Energy", "Climate"], status: "published",
    content: ["African leaders are building a regional energy system around local production and shared infrastructure. The approach prioritises reliable supply while reducing dependence on imported fuels.", "The plans include storage and distribution networks designed for communities of different scale and readiness."]
  },
  {
    id: "12", slug: "inside-the-creative-community-rebuilding-a-city", title: "Inside the creative community rebuilding a city", summary: "Artists, designers, and small businesses are creating cultural spaces that belong to everyone.", excerpt: "A new district is proving that creative work can be both commercial and community-led.", category: "World", author: "Sofia Laurent", authorRole: "Global Affairs Correspondent", date: "2026-10-03T14:00:00", readTime: "6 min read", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85", imageAlt: "A creative workshop with artists working together", tags: ["World", "Culture", "Creative Economy"], status: "published",
    content: ["The district’s success comes from a shared belief that art should be part of everyday life. Public spaces, workshops, and independent studios now form a visible network of creative activity.", "The model is helping artists earn sustainable livelihoods while inviting the wider community to participate in the city’s cultural life."]
  }
];

export const getArticleBySlug = (slug: string) => articles.find((article) => article.slug === slug && article.status === "published");
export const getArticlesByCategory = (category: Category) => articles.filter((article) => article.category === category && article.status === "published");
export const getCategoryArticles = (category: string) => articles.filter((article) => article.category === category && article.status === "published");
