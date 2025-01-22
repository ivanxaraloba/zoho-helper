export const scrollToRef = (ref: React.RefObject<HTMLElement>): void => {
  if (ref?.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const scrollToId = (id: string, margin: number = 50): void => {
  const element = document.getElementById(id);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - margin;
    window.scrollTo({ top, behavior: "smooth" });
  }
};
