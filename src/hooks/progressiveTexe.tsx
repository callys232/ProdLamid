import { useEffect, useState } from "react";

const useProgressiveTypewriter = (
  words: string[],
  gradients: string[],
  speed = 150,
  pause = 2000
) => {
  const [texts, setTexts] = useState<string[]>(Array(words.length).fill(""));
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (wordIndex < words.length) {
      const currentWord = words[wordIndex];
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setTexts((prev) => {
            const newTexts = [...prev];
            newTexts[wordIndex] = newTexts[wordIndex] + currentWord[charIndex];
            return newTexts;
          });
          setCharIndex((prev) => prev + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setWordIndex((prev) => prev + 1);
          setCharIndex(0);
        }, pause / 2);
      }
    } else {
      timeout = setTimeout(() => {
        setTexts(Array(words.length).fill(""));
        setWordIndex(0);
        setCharIndex(0);
      }, pause);
    }

    return () => clearTimeout(timeout);
  }, [wordIndex, charIndex, words, speed, pause]);

  return texts.map((text, i) => ({
    text,
    gradient: gradients[i % gradients.length],
  }));
};

export default useProgressiveTypewriter;
