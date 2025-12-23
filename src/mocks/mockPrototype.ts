// mocks/mockPrototypes.ts
export interface MockPrototype {
  id: string;
  name: string;
  imagePath: string;
  altText: string;
  price: number;
}

export const mockPrototypes: MockPrototype[] = [
  {
    id: "1",
    name: "Web Design",
    imagePath: "/prototype1.png",
    altText: "Business concept visualization prototype",
    price: 250,
  },
  {
    id: "2",
    name: "Mobile Rental Services",
    imagePath: "/prototype2.png",
    altText: "Product development prototype",
    price: 400,
  },
  {
    id: "3",
    name: "Event Planning",
    imagePath: "/prototype3.png",
    altText: "Project management prototype",
    price: 150,
  },
  {
    id: "4",
    name: "Gadget Replacement",
    imagePath: "/prototype4.png",
    altText: "Product design prototype",
    price: 300,
  },
];
