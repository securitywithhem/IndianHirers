import { foundersContent } from "@/content/founders";

export function StorySection() {
  const { paragraphs } = foundersContent.story;

  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith("## ")) {
          return (
            <h3 key={index} className="font-heading text-3xl text-gold mt-12 mb-6">
              {paragraph.replace("## ", "")}
            </h3>
          );
        }

        if (index === 0) {
          return (
            <p key={index} className="font-body text-cream/90 leading-relaxed mb-5">
              <span className="font-heading text-5xl text-gold float-left mr-2 leading-none">
                {paragraph.charAt(0)}
              </span>
              {paragraph.slice(1)}
            </p>
          );
        }
        return (
          <p key={index} className="font-body text-cream/90 leading-relaxed mb-5">
            {paragraph}
          </p>
        );
      })}
    </section>
  );
}
