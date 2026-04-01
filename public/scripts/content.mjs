export const siteContent = {
  brand: "Elbek Mirzamakhmudov",
  navigation: [
    { label: "Apps", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" }
  ],
  hero: {
    kicker: "Portfolio",
    name: "Elbek Mirzamakhmudov",
    title: "Flutter & iOS Developer",
    availability: "Available for select freelance and contract work",
    description:
      "I build polished mobile products in Flutter, SwiftUI, and UIKit, spanning client delivery platforms, public App Store launches, and award-winning side projects.",
    note:
      "Freelancing from Naples while continuing to sharpen product thinking, SwiftUI craft, and iOS execution through the Apple Developer Academy.",
    pills: ["Naples, Italy", "Flutter + iOS", "App Store delivery"],
    featuredProjectSlugs: ["1charge", "mystore-sales", "campy"],
    facts: [
      { label: "Current", value: "Freelance mobile developer working across client and product work." },
      { label: "Recognition", value: "Swift Student Challenge Winner 2026 with Campy." },
      { label: "Project", value: "Built PathMate during the SITE Hackathon in Trieste." },
      { label: "Shipping", value: "Production apps, store submission, and release support end to end." }
    ],
    primaryCta: { label: "View Apps", href: "#projects" },
    secondaryCta: { label: "Contact", href: "#contact" }
  },
  projects: [
    {
      slug: "1charge",
      name: "1Charge",
      icon: "1C",
      iconImage:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/6c/5e/96/6c5e9684-afe1-bf8f-b3b4-e6d540f3af75/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/100x100bb.jpg",
      tone: "forest",
      subtitle: "Freelance client app",
      description:
        "A freelance EV charging app project for finding nearby stations, filtering by connector and availability, opening navigation, scanning QR codes, and tracking charging progress, wallet balance, and history. The client asked me to publish it on my developer account.",
      tags: ["Freelance", "Client app", "Utilities", "Navigation"],
      links: {
        appStore: "https://apps.apple.com/us/app/1charge/id6758155197?uo=4",
        developerPage: "https://apps.apple.com/my/developer/elbek-mirzamaxmudov/id1861371580"
      }
    },
    {
      slug: "mystore-sales",
      name: "MyStore Sales",
      icon: "MS",
      iconImage:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5b/b3/6e/5bb36e96-268f-5186-00c5-08507579b894/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/100x100bb.jpg",
      tone: "stone",
      subtitle: "Freelance retail POS work",
      description:
        "Freelance work on MyStore Sales, a modern mobile POS system for small retail stores with sales automation, reports, employee management, and multi-branch operations. I also contributed around the product’s public web presence.",
      tags: ["Freelance", "Business", "POS", "Retail"],
      detail: {
        galleryTitle: "Project visuals",
        galleryIntro:
          "These public visuals come from the MyStore website. You can swap them for direct app screenshots later without touching the layout code.",
        gallery: [
          {
            src: "https://mystoreapp.uz/screens/collage.png",
            alt: "MyStore public product collage",
            title: "Website product collage",
            caption: "Public marketing collage used on mystoreapp.uz."
          },
          {
            src: "https://mystoreapp.uz/og.png",
            alt: "MyStore open graph visual",
            title: "Launch visual",
            caption: "Public social preview image from the product site."
          }
        ]
      },
      links: {
        appStore: "https://apps.apple.com/uz/app/mystore-sales/id6739307062?uo=4",
        website: "https://mystoreapp.uz/"
      }
    },
    {
      slug: "noor",
      name: "Noor",
      icon: "NO",
      iconImage:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/88/d4/08/88d408cb-75a5-d01d-ad2c-d4125dc0c426/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/100x100bb.jpg",
      tone: "forest",
      subtitle: "Customer delivery app at Noor",
      description:
        "The main customer app I worked on during my time at Noor, built for fast and secure delivery orders across parcels, flowers, gifts, and pharmacy purchases. My work covered production Flutter implementation, release work, and the broader delivery product ecosystem alongside the driver experience.",
      tags: ["Noor", "Delivery", "Production", "Flutter"],
      links: {
        appStore: "https://apps.apple.com/uz/app/noor%E3%85%A4/id6737517568?uo=4",
        website: "https://noor.uz/"
      }
    },
    {
      slug: "homefix",
      name: "HomeFix",
      icon: "HF",
      tone: "stone",
      subtitle: "Contract mobile application work",
      description:
        "Short-term contract work on the HomeFix application for a home services business in Uzbekistan. I’m keeping the public write-up concise here, but it represents another real client-facing product I helped bring to mobile.",
      tags: ["Contract", "Services", "Mobile app", "Uzbekistan"],
      detail: {
        overview: [
          "HomeFix was contract mobile application work for a home services business in Uzbekistan.",
          "Because the project is older and not publicly active in the App Store, it lives behind a dedicated project page instead of adding noise to the main portfolio grid."
        ],
        highlights: [
          "Client-facing contract mobile work",
          "Archived project kept separate from current live store releases",
          "Ready for screenshots whenever you want to add them"
        ],
        galleryTitle: "Screenshots",
        galleryIntro:
          "This page is intentionally prepared for older or unpublished work, so you can show screens here without cluttering the homepage.",
        emptyGalleryTitle: "Add HomeFix screens here",
        emptyGalleryText:
          "This archived project is ready for screenshots whenever you want to surface them without expanding the homepage card."
      },
      links: {
        website: "https://homefixuz.com/"
      }
    },
    {
      slug: "campy",
      name: "Campy",
      icon: "CA",
      iconImage:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3f/ea/73/3fea730e-30b2-d397-18e3-8a928bcf0866/__PlaceholderAppIcon-0-0-1x_U007epad-0-1-85-220.png/100x100bb.jpg",
      tone: "sand",
      subtitle: "Offline wilderness survival guide",
      description:
        "An offline wilderness survival guide built for hikers, campers, and outdoor travelers. Campy was the project behind my Swift Student Challenge 2026 win, combining calm information design with practical emergency guidance when signal is unavailable.",
      tags: ["Swift", "Travel", "Offline", "Swift Student Challenge"],
      links: {
        appStore: "https://apps.apple.com/us/app/campy/id6761032968?uo=4",
        developerPage: "https://apps.apple.com/my/developer/elbek-mirzamaxmudov/id1861371580"
      }
    },
    {
      slug: "pathmate",
      name: "PathMate",
      icon: "PM",
      iconImage:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3f/25/55/3f2555ac-4666-b26b-7a2b-29498f0268ee/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/100x100bb.jpg",
      tone: "olive",
      subtitle: "Accessible travel navigation",
      description:
        "An AI-powered accessibility navigation app built to support equal travel experiences through adaptive wheelchair routes, high-safety routes for visually impaired users, focus modes for autistic users, AI camera accessibility scanning, and voice plus haptic guidance. PathMate was developed during the SITE Hackathon in Trieste.",
      tags: ["Accessibility", "AI", "Hackathon", "Travel"],
      links: {
        appStore: "https://apps.apple.com/us/app/pathmate/id6756574854?uo=4",
        developerPage: "https://apps.apple.com/my/developer/elbek-mirzamaxmudov/id1861371580"
      }
    },
    {
      slug: "ninja-frog",
      name: "Ninja Frog",
      icon: "NF",
      iconImage:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/a4/52/4f/a4524f89-0b15-bc8a-7331-ef1bb4a4fa64/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/100x100bb.jpg",
      tone: "ink",
      subtitle: "Pixel platformer",
      description:
        "A compact retro-inspired platformer and my first game project, built with Flutter and the Flame engine. It focuses on tight movement, quick retries, collectible runs, and simple handcrafted stages.",
      tags: ["Flutter", "Flame", "Games", "First game"],
      links: {
        appStore: "https://apps.apple.com/us/app/ninja-frog/id6761032109?uo=4",
        developerPage: "https://apps.apple.com/my/developer/elbek-mirzamaxmudov/id1861371580"
      }
    },
    {
      slug: "interviewos",
      name: "InterviewOS",
      icon: "IO",
      iconImage:
        "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e3/7d/88/e37d88bc-7ba6-8766-e04d-dead3dfce909/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/100x100bb.jpg",
      tone: "clay",
      subtitle: "Developer interview prep",
      description:
        "A free offline interview-preparation app for Flutter/Dart and Swift/iOS developers, with lessons, tap-based exercises, quizzes, and 500+ real interview questions.",
      tags: ["Education", "Productivity", "Offline", "iPhone"],
      links: {
        appStore: "https://apps.apple.com/us/app/interviewos/id6756553689?uo=4",
        developerPage: "https://apps.apple.com/my/developer/elbek-mirzamaxmudov/id1861371580"
      }
    }
  ],
  experience: [
    {
      role: "Freelance Mobile Application Developer",
      company: "Independent Clients",
      companyLinks: [{ label: "Visit MyStore", href: "https://mystoreapp.uz/" }],
      dates: "October 2025 — Present",
      impact: [
        "Take on freelance mobile work across retail, mobility, and utility products based on client needs, timelines, and release scope.",
        "Worked on client projects including MyStore Sales, 1Charge, and HomeFix, covering implementation, iteration, and production delivery.",
        "Support real-world launches with practical engineering decisions, store submission work, account-side publishing support when needed, and ongoing release maintenance."
      ]
    },
    {
      role: "Flutter Developer",
      company: "Noor | Delivery Platform",
      companyLinks: [{ label: "Visit noor.uz", href: "https://noor.uz/" }],
      dates: "September 2024 — October 2025",
      impact: [
        "Led end-to-end development of the Noor customer app from scratch, translating business requirements into a scalable delivery platform with real-time order tracking.",
        "Architected the driver companion app with custom voice-guided navigation, real-time route management, and Yandex MapKit integration.",
        "Published and maintained both apps on the App Store and Google Play while collaborating with product owners, designers, and backend engineers in Agile sprints."
      ]
    },
    {
      role: "Flutter Developer",
      company: "Githubit | Software Company",
      companyLinks: [
        { label: "Visit githubit.com", href: "https://githubit.com/" },
        {
          label: "View CodeCanyon portfolio",
          href: "https://codecanyon.net/user/githubit/portfolio?srsltid=AfmBOoqf821VTcQo_UD1PfWQQVEkWtkTiZE7goIkcefnBh-nWLw4Sm0M"
        }
      ],
      dates: "July 2023 — September 2024",
      impact: [
        "Developed, customized, and deployed multi-platform mobile applications for diverse business clients with different branding and regional requirements.",
        "Managed the full app lifecycle from integration and testing through App Store and Google Play publishing.",
        "Contributed to Foodyman, a bestselling multi-role food commerce platform built with Laravel, Flutter, and Next.js."
      ]
    }
  ],
  education: [
    {
      institution: "Apple Developer Academy",
      location: "Naples, Italy",
      dates: "October 2025 — June 2026",
      description:
        "Intensive program in iOS development with Swift, SwiftUI, app design, and innovation. Scholarship recipient."
    },
    {
      institution: "Tashkent State University of Economics",
      location: "Tashkent, Uzbekistan",
      dates: "2023 — 2028",
      description: "Bachelor’s in World Economy."
    }
  ],
  skillGroups: [
    {
      title: "Languages & frameworks",
      items: ["Swift", "Flutter", "Dart", "JavaScript", "Python", "Kotlin fundamentals"]
    },
    {
      title: "Mobile development",
      items: ["UIKit", "SwiftUI", "App architecture", "Modular design", "Provider", "Bloc", "Riverpod"]
    },
    {
      title: "APIs & backend",
      items: ["RESTful APIs", "WebSocket", "Firebase Auth", "Firestore", "FCM", "FastAPI"]
    },
    {
      title: "Maps & delivery",
      items: ["Yandex MapKit", "Google Maps SDK", "Voice-guided navigation", "Route management"]
    },
    {
      title: "Tools & shipping",
      items: ["Git", "CI/CD", "Agile/Scrum", "TDD", "Performance optimization", "App Store Connect", "Google Play Console"]
    }
  ],
  contact: {
    heading: "Let’s build thoughtful mobile products.",
    description:
      "I’m open to mobile roles, selective freelance work, and product teams that care about polish, performance, and disciplined execution.",
    links: [
      { label: "Email", href: "mailto:elbekmirzamakhmudov@gmail.com" },
      { label: "LinkedIn", href: "https://linkedin.com/in/elbek-mirzamakhmudov" },
      { label: "GitHub", href: "https://github.com/elbeekk" },
      { label: "App Store", href: "https://apps.apple.com/my/developer/elbek-mirzamaxmudov/id1861371580" }
    ]
  },
  footer:
    "Elbek Mirzamakhmudov — Flutter & iOS developer focused on calm interfaces, careful execution, and durable product decisions."
};

export function getProjectHref(slug) {
  return `./project.html?slug=${encodeURIComponent(slug)}`;
}

export function getProjectBySlug(slug) {
  return siteContent.projects.find((project) => project.slug === slug) ?? null;
}
