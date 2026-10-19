export const assets = "/assets"

export const features = [
  {
    title: "Cozy Study Space",
    description: "Our café is designed with students in mind.",
    action: "Find Us",
    href: "/?section=find-us",
    image: `${assets}/21534.png`,
    position: "center",
  },
  {
    title: "Bundles for Everyone",
    description: "Cramming for an exam? Taking a break?",
    action: "Get Promos",
    href: "/?section=promotions",
    image: `${assets}/54bac.png`,
    position: "center 35%",
  },
  {
    title: "Plenty of Charging Outlets",
    description: "No more fighting for sockets and seats!",
    action: "Read More",
    href: "/about",
    image: `${assets}/9ea42.png`,
    position: "center",
  },
]

export const promotions = [
  {
    title: "Student Fuel Bundle",
    description: "Grab a friend for a second drink at 50% off!",
    className: "student-art",
    image: `${assets}/promo-student.png`,
    alt: "Two iced coffee drinks",
  },
  {
    title: "Group Grind Bundle",
    description: "Brew your distinctions. Buy 3 coffees, and get 1 free.",
    className: "group-art",
    image: `${assets}/promo-group.png`,
    alt: "Four assorted coffee drinks",
  },
  {
    title: "Faculty Break Bundle",
    description: "Take a breather and have a coffee and sandwich break.",
    className: "faculty-art",
    image: `${assets}/promo-faculty.png`,
    alt: "A wrap and a cup of tea",
  },
]

export type MenuAttribute = "iced" | "hot" | "vegetarian"

export type MenuItem = {
  name: string
  price: string
  image: string
  attributes: MenuAttribute[]
}

export type Outlet = {
  address: string
  label: string
  amenities: string[]
}

export const featuredOutlet: Outlet = {
  address: "50 Nanyang Ave, S1-B3c-26, S(639798)",
  label: "Main campus café",
  amenities: ["Study-friendly", "Charging", "Wi-Fi"],
}

export const locations: Outlet[] = [
  {
    address: "500 Dover Rd, S(139651)",
    label: "Dover campus",
    amenities: ["Quick takeaway", "Wi-Fi"],
  },
  {
    address: "15 Kent Ridge Dr, #01-03, S(119245)",
    label: "Kent Ridge campus",
    amenities: ["Study-friendly", "Charging"],
  },
  {
    address: "71 Nanyang Dr, Level 3, S(638075)",
    label: "Nanyang campus",
    amenities: ["Group seating", "Charging"],
  },
]

const iced: MenuAttribute[] = ["iced"]
const hot: MenuAttribute[] = ["hot"]
const vegetarian: MenuAttribute[] = ["vegetarian"]

export const menuSections: Array<{
  id: string
  title: string
  items: MenuItem[]
}> = [
  {
    id: "coffee",
    title: "Coffee",
    items: [
      { name: "Iced Latte", price: "$4", image: "78f27.png", attributes: iced },
      {
        name: "Iced Long Black",
        price: "$4.50",
        image: "5efb3.png",
        attributes: iced,
      },
      {
        name: "Iced Mocha",
        price: "$4.50",
        image: "9af58.png",
        attributes: iced,
      },
      {
        name: "Iced Caramel Mocha",
        price: "$5",
        image: "28c1c.png",
        attributes: iced,
      },
      {
        name: "Iced Orange Latte",
        price: "$4.50",
        image: "e3723.png",
        attributes: iced,
      },
    ],
  },
  {
    id: "tea",
    title: "Tea",
    items: [
      { name: "Oolong Tea", price: "$4", image: "2985b.png", attributes: hot },
      {
        name: "Earl Gray Tea",
        price: "$4",
        image: "1b2bf.png",
        attributes: hot,
      },
      {
        name: "Peppermint Tea",
        price: "$4",
        image: "4cb74.png",
        attributes: hot,
      },
    ],
  },
  {
    id: "matcha",
    title: "Matcha",
    items: [
      {
        name: "Matcha Latte",
        price: "$5",
        image: "8871d.png",
        attributes: iced,
      },
      {
        name: "Strawberry Matcha Latte",
        price: "$5.50",
        image: "fef42.png",
        attributes: iced,
      },
      {
        name: "Coconut Matcha Latte",
        price: "$4.50",
        image: "8a5a6.png",
        attributes: iced,
      },
    ],
  },
  {
    id: "bites",
    title: "Bites",
    items: [
      {
        name: "Croissant",
        price: "$3.50",
        image: "8c86f.png",
        attributes: vegetarian,
      },
      {
        name: "Chocolate Muffin",
        price: "$3.50",
        image: "a1821.png",
        attributes: vegetarian,
      },
      { name: "Chicken Wrap", price: "$5", image: "c554a.png", attributes: [] },
    ],
  },
]

export const categoryLinks = [
  { label: "Promotions", id: "menu-promotions", icon: "ed83a.png" },
  { label: "Coffee", id: "coffee", icon: "5aac9.png" },
  { label: "Tea", id: "tea", icon: "13b53.png" },
  { label: "Matcha", id: "matcha", icon: "a07bb.png" },
  { label: "Bites", id: "bites", icon: "c931a.png" },
]

export const beanProfiles = [
  {
    country: "Ethiopia",
    notes: "Jasmine · citrus · stone fruit",
    description:
      "A fragrant, fruit-forward coffee with floral aromatics and a tea-like finish that stays expressive over ice.",
    pairing: "Try it as: iced long black or filter coffee",
  },
  {
    country: "Colombia",
    notes: "Caramel · red apple · cocoa",
    description:
      "A balanced, naturally sweet profile with gentle acidity and enough structure to work black or with milk.",
    pairing: "Try it as: espresso, latte, or long black",
  },
  {
    country: "Brazil",
    notes: "Milk chocolate · hazelnut · brown sugar",
    description:
      "A rounded, comforting coffee with low acidity, a creamy body, and familiar chocolate-and-nut sweetness.",
    pairing: "Try it as: cappuccino, mocha, or iced latte",
  },
]
