export type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

export type Category = {
  title: string
  slug: string
  shortTitle: string
  phrase: string
  description: string
  previewImage: string
  images: GalleryImage[]
}

export const siteSettings = {
  title: 'WCashDesign',
  description:
    'AI image edits, restorations, flyers, logos, headshots, mock covers, and custom visual designs.',
  url: 'https://wcashdesign.com',
  phoneDisplay: '980-226-0846',
  phoneHref: 'tel:+19802260846',
  email: 'cashville@twc.com',
  instagram: 'https://www.instagram.com/wcashdesign/',
  formspreeEndpoint: 'https://formspree.io/f/mgojyqdy',
  logo: '/assets/Home/wcashdesign-header-logo-wide.png',
  squareLogo: '/assets/Home/light-logo-square.png',
  circleLogo: '/assets/Home/light-logo-circle.png',
  socialPreviewImage: '/assets/Home/light-logo-square.png',
}

export const homePage = {
  heroKicker: 'AI image design • restorations • custom edits',
  heroTitle: 'Custom AI edits made to stand out',
  heroText:
    'I create image restorations, flyers, logos, professional headshots, mock covers, posters, and custom AI edits for personal moments, brands, celebrations, and business ideas.',
  primaryAction: 'View portfolio',
  primaryActionLink: '/portfolio/',
  secondaryAction: 'Book a consultation',
  secondaryActionLink: '/consultation/',
  featuredImages: [] as GalleryImage[],
  marqueeItems: [
    {label: 'AI edits', href: '/portfolio/creations-and-edits/'},
    {label: 'Photo restoration', href: '/portfolio/restorations/'},
    {label: 'Flyers', href: '/portfolio/flyers-posters/'},
    {label: 'Logos', href: '/portfolio/logos/'},
    {label: 'Headshots', href: '/portfolio/professional-headshots/'},
    {label: 'Mock covers', href: '/portfolio/magazines-newspaper-mockups/'},
  ],
  aboutKicker: 'About the artist',
  aboutTitle: 'Hi, this is Walter',
  aboutText:
    "I'm a design artist, and I make image restorations, flyers, logos, business headshots, mock newspaper and magazine covers, movie-style posters, book covers, and custom AI image variations. If you need something cleaned up, reimagined, or created image-wise, give me a call or send me a text.",
  aboutImage: '/assets/Home/about photo.png',
  contactLabel: 'Contact me here',
  portfolioKicker: 'Portfolio',
  portfolioTitle: 'Choose a style,\nthen see more like it',
  portfolioLinkLabel: 'View the full portfolio ↗',
  consultationKicker: 'Start a project',
  consultationTitle: 'Have an idea? Send the image and the vision.',
  consultationText:
    'I can help shape the right visual direction — restoration, flyer, headshot, logo, mock cover, or something completely custom.',
}

export const categories: Category[] = [
  {
    title: 'Restorations',
    shortTitle: 'Restorations',
    slug: 'restorations',
    phrase: 'Old, damaged, or faded photos refreshed with care.',
    description:
      'Photo restoration and enhancement for family images, keepsakes, and meaningful memories.',
    previewImage: '/assets/Restorations/10res04.png',
    images: [
      {src: '/assets/Restorations/10res04.png', alt: 'Photo restoration sample'},
      {src: '/assets/Restorations/15res02.png', alt: 'Restored portrait image'},
      {src: '/assets/Restorations/20res03.png', alt: 'Enhanced old photograph'},
    ],
  },
  {
    title: 'Creations and Edits',
    shortTitle: 'Creations',
    slug: 'creations-and-edits',
    phrase: 'Original AI scenes, stylized edits, and imaginative transformations.',
    description:
      'Custom AI-assisted visuals for portraits, concepts, occasions, and one-of-one creative ideas.',
    previewImage: '/assets/Creations and Edits/05creat02.png',
    images: [
      {src: '/assets/Creations and Edits/05creat02.png', alt: 'AI creative portrait edit'},
      {src: '/assets/Creations and Edits/10creat09.png', alt: 'AI creative image variation'},
      {src: '/assets/Creations and Edits/15creat12.png', alt: 'Custom AI design edit'},
      {src: '/assets/Creations and Edits/20creat05.jpg', alt: 'Stylized AI edit'},
      {src: '/assets/Creations and Edits/25creat14.png', alt: 'AI generated photo concept'},
      {src: '/assets/Creations and Edits/30creat03.png', alt: 'Custom image transformation'},
      {src: '/assets/Creations and Edits/35creat06.png', alt: 'Creative image edit'},
      {src: '/assets/Creations and Edits/40creat07.png', alt: 'AI edited portrait concept'},
      {src: '/assets/Creations and Edits/45creat11.png', alt: 'Designed AI image'},
      {src: '/assets/Creations and Edits/50creat04.png', alt: 'AI visual creation'},
    ],
  },
  {
    title: 'Flyers & Posters',
    shortTitle: 'Flyers',
    slug: 'flyers-posters',
    phrase: 'Event-ready flyers and bold poster-style graphics.',
    description:
      'Promotional designs for events, announcements, personal brands, and creative campaigns.',
    previewImage: '/assets/Flyers & Posters/05.png',
    images: [
      {src: '/assets/Flyers & Posters/05.png', alt: 'Custom flyer design'},
      {src: '/assets/Flyers & Posters/10post03.png', alt: 'Poster design mockup'},
      {src: '/assets/Flyers & Posters/12post01.jpg', alt: 'Event poster graphic'},
      {src: '/assets/Flyers & Posters/15post02.png', alt: 'Promotional poster design'},
      {src: '/assets/Flyers & Posters/25fly04.png', alt: 'Custom flyer artwork'},
      {src: '/assets/Flyers & Posters/30fly06.png', alt: 'Flyer layout design'},
      {src: '/assets/Flyers & Posters/35.png', alt: 'Poster layout design'},
      {src: '/assets/Flyers & Posters/40fly07.png', alt: 'Flyer design sample'},
    ],
  },
  {
    title: 'Logos',
    shortTitle: 'Logos',
    slug: 'logos',
    phrase: 'Clean marks and brand graphics for ideas that need an identity.',
    description:
      'Logo concepts and graphic marks for businesses, events, personal brands, and creative projects.',
    previewImage: '/assets/Logos/05logo02.png',
    images: [
      {src: '/assets/Logos/05logo02.png', alt: 'Logo design sample'},
      {src: '/assets/Logos/10logo08png.png', alt: 'Custom logo graphic'},
      {src: '/assets/Logos/15logo03.png', alt: 'Brand logo design'},
      {src: '/assets/Logos/20LOGO06.png', alt: 'Logo concept design'},
      {src: '/assets/Logos/25logo07.png', alt: 'Custom brand mark'},
      {src: '/assets/Logos/30logo05.png', alt: 'Logo artwork'},
    ],
  },
  {
    title: 'Magazines & Newspaper Mockups',
    shortTitle: 'Mock Covers',
    slug: 'magazines-newspaper-mockups',
    phrase: 'Magazine and newspaper-style covers with your image at the center.',
    description:
      'Personalized mock publications for gifts, milestones, promotions, celebrations, and keepsakes.',
    previewImage: '/assets/Magazines & Newspaper Mockups/11magazine06.png',
    images: [
      {src: '/assets/Magazines & Newspaper Mockups/11magazine06.png', alt: 'Magazine cover mockup'},
      {src: '/assets/Magazines & Newspaper Mockups/22magazine03.png', alt: 'Custom magazine cover'},
      {src: '/assets/Magazines & Newspaper Mockups/33News01.png', alt: 'Newspaper mockup design'},
      {src: '/assets/Magazines & Newspaper Mockups/44magazine02.png', alt: 'Magazine cover artwork'},
      {src: '/assets/Magazines & Newspaper Mockups/55magazine05.png', alt: 'Personalized magazine design'},
      {src: '/assets/Magazines & Newspaper Mockups/77News02.png', alt: 'Custom newspaper cover'},
    ],
  },
  {
    title: 'Movie Poster & Book Mockups',
    shortTitle: 'Posters & Books',
    slug: 'movie-poster-book-mockups',
    phrase: 'Cinematic posters and book-cover concepts starring your image.',
    description:
      'Mock movie flyers, dramatic posters, and book-cover designs for gifts, promos, or pure fun.',
    previewImage: '/assets/Movie Poster & Book Mockups/05movie003.png',
    images: [
      {src: '/assets/Movie Poster & Book Mockups/05movie003.png', alt: 'Movie poster mockup'},
      {src: '/assets/Movie Poster & Book Mockups/10book01.png', alt: 'Book cover mockup'},
      {src: '/assets/Movie Poster & Book Mockups/15movie005.png', alt: 'Custom movie flyer'},
      {src: '/assets/Movie Poster & Book Mockups/20movie06.png', alt: 'Movie poster design'},
      {src: '/assets/Movie Poster & Book Mockups/25movie004.png', alt: 'Cinematic poster mockup'},
      {src: '/assets/Movie Poster & Book Mockups/30book03.png', alt: 'Custom book cover design'},
      {src: '/assets/Movie Poster & Book Mockups/35movie002.png', alt: 'Movie flyer concept'},
    ],
  },
  {
    title: 'Professional Headshots',
    shortTitle: 'Headshots',
    slug: 'professional-headshots',
    phrase: 'Business-ready headshots created from everyday photos.',
    description:
      'Professional portrait transformations for profiles, resumes, websites, and business branding.',
    previewImage: '/assets/Professional Headshots/10head04.png',
    images: [
      {src: '/assets/Professional Headshots/10head04.png', alt: 'Professional headshot transformation'},
      {src: '/assets/Professional Headshots/15head02.png', alt: 'Business headshot edit'},
      {src: '/assets/Professional Headshots/25head03.png', alt: 'AI professional portrait'},
      {src: '/assets/Professional Headshots/30head05.png', alt: 'Professional portrait sample'},
    ],
  },
]

export const consultationPage = {
  title: 'Start a custom image project',
  intro:
    'Tell me what you want created, restored, or transformed. Share the occasion, image type, timeline, and the best way to reach you.',
  note: 'Prefer to talk it through? Call or text 980-226-0846.',
  formTitle: 'Project details',
  formspreeEndpoint: 'https://formspree.io/f/mgojyqdy',
  nameLabel: 'Name',
  contactLabel: 'Email or phone',
  projectTypeLabel: 'What do you want made?',
  projectTypeOptions: [
    'AI creation or edit',
    'Photo restoration',
    'Flyer or poster',
    'Logo',
    'Magazine or newspaper mockup',
    'Movie poster or book cover',
    'Professional headshot',
    'Something else',
  ],
  messageLabel: 'Project details',
  messagePlaceholder: 'Tell me what you want created, restored, or changed.',
  submitButtonLabel: 'Send consultation request',
}
