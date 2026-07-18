import { foundersContent } from "@/content/founders";

export function StorySection() {
  const { paragraphs } = foundersContent.story;

  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      {paragraphs.map((paragraph, index) => {
        if (index === 0) {
          return (
            <p key={index} className="font-body text-text/90 leading-relaxed mb-5" data-aos="fade-up">
              <span className="font-heading text-5xl text-gold-text float-left mr-2 leading-none">
                {paragraph.charAt(0)}
              </span>
              {paragraph.slice(1)}
            </p>
          );
        }
        return (
          <p key={index} className="font-body text-text/90 leading-relaxed mb-5">
            {paragraph}
          </p>
        );
      })}
    </section>
  );
}
