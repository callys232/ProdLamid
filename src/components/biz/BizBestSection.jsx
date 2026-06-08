import React from "react";
import styles from "./BizBestSection.module.css";

const services = [
  {
    image: "/biz-clientcenter.png",
    text: "Design & execute a lean client-centred plan.",
  },
  {
    image: "/biz-achieve.png",
    text: "Achieve greater prospects conversion.",
  },
  {
    image: "/biz-top-notch.png",
    text: "Build a top-notch team to deliver real-time value.",
  },
  {
    image: "/biz-digitalsystem.png",
    text: "Digitalize systems structure & processes.",
  },
  {
    image: "/biz-dominate.png",
    text: "Become globally accessible & Dominate the market.",
  },
  {
    image: "/biz-builds.svg",
    text: "Build capacity & trust with ventured capitalist.",
  },
  {
    image: "/biz-rapid-growth.png",
    text: "Deliver rapid and sustainable growth.",
  },
  {
    image: "/biz-running-figure.png",
    text: "Avert crisis & Distress.",
  },
];

const PATTERNS = [
  styles.patternGrid,
  styles.patternDiag,
  styles.patternDots,
  styles.patternHLines,
  styles.patternVLines,
  styles.patternCounterDiag,
  styles.patternCrosshatch,
  styles.patternLargeDots,
];

const BusinessServicesGlareGrid = () => (
  <section className="bg-black py-12 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service, index) => (
        <div key={index} className={styles.card}>
          {/* Background image — independently blurred and darkened on hover */}
          <div
            className={styles.cardBg}
            style={{ backgroundImage: `url(${service.image})` }}
          />
          {/* Progressive dark tint layer */}
          <div className={styles.tint} />
          {/* Unique vector pattern per card — appears on hover */}
          <div className={`${styles.vectorOverlay} ${PATTERNS[index % PATTERNS.length]}`} />
          {/* Radial highlight behind text */}
          <div className={styles.radialHighlight} />
          {/* Text — always visible at bottom, brightens and sharpens on hover */}
          <div className={styles.textWrap}>
            <p className={styles.text}>{service.text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default BusinessServicesGlareGrid;
