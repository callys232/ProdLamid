// components/ServicesSection.jsx
import Image from "next/image";
import Link from "next/link";

const ServiceCard = ({ title, icon, coloredLetters }) => {
  // Function to apply color to specific letters in the title
  const colorizedTitle = () => {
    const letters = title.split("");

    return letters.map((letter, index) => {
      if (coloredLetters.includes(index)) {
        return (
          <span key={index} className="text-blue-500">
            {letter}
          </span>
        );
      }
      return <span key={index}>{letter}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center mb-8">
      {/* <div className="border border-blue-500 rounded-md p-3 mb-4"> */}
      <Image
        src={icon}
        alt={title}
        width={80}
        height={80}
        className="w-28 h-24 object-contain"
      />
      {/* </div> */}
      <h3 className="text-xl font-semibold">{colorizedTitle()}</h3>
    </div>
  );
};

// const ServiceButton = ({ title, icon, bgColor }) => {
//   return (
//     <div
//       className={`${bgColor} rounded-md p-4 flex flex-col items-center justify-center h-28 w-full max-w-xs mx-auto relative`}
//     >
//       <Image
//         src={icon}
//         alt={title}
//         width={24}
//         height={24}
//         className="w-6 h-6 object-contain mb-2"
//       />
//       <p className="text-white text-sm md:text-base text-center">{title}</p>
//     </div>
//   );
// };

const ServiceButton = ({ title, icon, bgColor }) => {
  // Determine the link based on the background color
  const getLink = () => {
    switch (bgColor) {
      case 'bg-green-800':
        return '/sustainableDev';
      case 'bg-blue-600':
        return '/biz';
      case 'bg-amber-900':
        return '/hcd';
      default:
        return '#'; // Default link if no match
    }
  };

  // Get the appropriate link for this button
  const link = getLink();

  return (
    <Link href={link}>
      <div
        className={`${bgColor} rounded-md p-4 flex flex-col items-center justify-center h-28 w-full max-w-xs mx-auto relative cursor-pointer transition-transform hover:scale-105`}
      >
        <Image
          src={icon}
          alt={title}
          width={24}
          height={24}
          className="w-6 h-6 object-contain mb-2"
        />
        <p className="text-white text-sm md:text-base text-center">{title}</p>
      </div>
    </Link>
  );
};

// Custom component for items without background
const TextOnlyButton = ({ title, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-24 sm:h-28 md:h-32 w-full">
      <Image
        src={icon}
        alt={title}
        width={24}
        height={24}
        className="w-5 h-5 sm:w-6 sm:h-6 object-contain mb-1 sm:mb-2"
      />
      <p className="text-white text-xs sm:text-sm md:text-base text-center line-clamp-2">
        {title}
      </p>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <div className="bg-black text-white min-h-screen px-4 md:px-8 lg:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Services Header */}
        <div className="border border-white inline-block px-6 py-2 mb-8">
          <h2 className="text-xl">SERVICES</h2>
        </div>

        <div className="w-full h-px bg-gray-700 mb-6"></div>

        {/* Main Description */}
        <div className="mb-12">
          <p className="mb-4 md:text-lg">
            We reveal uncommon opportunities from everyday ideas and grow you to
            dominate the competition. We are known for transforming
            organizations using customized Management Solutions, Innovation
            Consulting, Strategy, Process Improvement and Talent Development.
          </p>
        </div>

        {/* Main Service Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <ServiceCard
            title="Business Innovation Zone"
            icon="/biz-icon.png"
            coloredLetters={[0, 9, 20]}
          />
          <ServiceCard
            title="Human Capital Development"
            icon="/human-capital-icon.png"
            coloredLetters={[0, 6, 14]}
          />
          <ServiceCard
            title="Sustainable Development"
            icon="/sustainable-icon.png"
            coloredLetters={[0, 12]}
          />
        </div>

        {/* Responsive Service Grid */}
        <div className="w-full mx-auto">
          {/* Desktop Layout (md screens and up) */}
          <div className="hidden md:block">
            {/* Top Row (3 items) */}
            <div className="grid grid-cols-3 gap-4 mb-4 max-w-4xl mx-auto">
              <ServiceButton
                title="Process Transformation"
                icon="/rocket-icon.png"
                bgColor="bg-blue-600"
              />
              <TextOnlyButton
                title="Innovation Consulting"
                icon="/rocket-icon.png"
              />
              <ServiceButton
                title="Sustainable Development"
                icon="/rocket-icon.png"
                bgColor="bg-green-800"
              />
            </div>

            {/* Bottom Row (5 items) */}
            <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
              <ServiceButton
                title="Digital Transformation"
                icon="/chart-icon.png"
                bgColor="bg-blue-600"
              />
              <TextOnlyButton
                title="Strategy Development"
                icon="/rocket-icon.png"
              />
              <ServiceButton
                title="Talent Sourcing"
                icon="/people-icon.png"
                bgColor="bg-amber-900"
              />
              <ServiceButton
                title="Management Solutions"
                icon="/rocket-icon.png"
                bgColor="bg-black"
              />
              <ServiceButton
                title="HR, Training & Support"
                icon="/rocket-icon.png"
                bgColor="bg-amber-900"
              />
            </div>
          </div>

          {/* Tablet Layout (sm screens) */}
          <div className="hidden sm:block md:hidden">
            {/* Top Row (3 items) */}
            <div className="grid grid-cols-3 gap-3 mb-3 mx-auto">
              <ServiceButton
                title="Process Transformation"
                icon="/rocket-icon.png"
                bgColor="bg-blue-700"
              />
              <TextOnlyButton
                title="Innovation Consulting"
                icon="/rocket-icon.png"
              />
              <ServiceButton
                title="Sustainable Development"
                icon="/rocket-icon.png"
                bgColor="bg-green-800"
              />
            </div>

            {/* Bottom Rows (3+2 items) */}
            <div className="grid grid-cols-3 gap-3 mb-3 mx-auto">
              <ServiceButton
                title="Digital Transformation"
                icon="/chart-icon.png"
                bgColor="bg-blue-600"
              />
              <TextOnlyButton
                title="Strategy Development"
                icon="/rocket-icon.png"
              />
              <ServiceButton
                title="Talent Sourcing"
                icon="/people-icon.png"
                bgColor="bg-amber-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mx-auto">
              <ServiceButton
                title="Management Solutions"
                icon="/rocket-icon.png"
                bgColor="bg-black"
              />
              <ServiceButton
                title="HR, Training & Support"
                icon="/rocket-icon.png"
                bgColor="bg-amber-900"
              />
            </div>
          </div>

          {/* Mobile Layout (xs screens) */}
          <div className="block sm:hidden">
            {/* Stack all items in 2 columns */}
            <div className="grid grid-cols-2 gap-2 mx-auto">
              <ServiceButton
                title="Process Transformation"
                icon="/rocket-icon.png"
                bgColor="bg-blue-700"
              />
              <TextOnlyButton
                title="Innovation Consulting"
                icon="/rocket-icon.png"
              />
              <ServiceButton
                title="Sustainable Development"
                icon="/rocket-icon.png"
                bgColor="bg-green-800"
              />
              <ServiceButton
                title="Digital Transformation"
                icon="/chart-icon.png"
                bgColor="bg-blue-600"
              />
              <TextOnlyButton
                title="Strategy Development"
                icon="/rocket-icon.png"
              />
              <ServiceButton
                title="Talent Sourcing"
                icon="/people-icon.png"
                bgColor="bg-amber-900"
              />
              <ServiceButton
                title="Management Solutions"
                icon="/rocket-icon.png"
                bgColor="bg-black"
              />
              <ServiceButton
                title="HR, Training & Support"
                icon="/rocket-icon.png"
                bgColor="bg-amber-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
