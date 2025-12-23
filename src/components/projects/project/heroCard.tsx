// src/components/project/HeroImageCard.tsx
import Card from "./card";
import Image from "next/image";

export default function HeroImageCard({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  return (
    <Card>
      <div className="w-full h-72 relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </Card>
  );
}
