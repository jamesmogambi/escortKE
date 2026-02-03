import SectionCard from "@/components/SectionCard";
import React from "react";

const SectionArticle = () => {
  return (
    <article>
      <SectionCard>
        {/* section */}
        <div className="font-semibold">
          <h2 className="text-2xl mb-3 font-normal mb-3 gap-3 flex items-center ">
            <span className="border-4 border-primary rounded-full w-8 h-8 flex items-center justify-center">
              1
            </span>
            What is BDSM?
          </h2>

          <p>
            BDSM is a term used to describe sexual practices that involve
            dominance, submission, and control. It usually involves one partner
            taking a more dominant role during sex, while the other is more
            submissive.
          </p>

          <p className="my-4">
            The abbreviation BDSM can be divided into these categories:
          </p>

          <div className="space-y-5">
            <p className="">
              <span className="size-3 inline-block bg-red-500 rounded-full "></span>{" "}
              <span className="font-bold">Bondage</span> : Restricting a
              partner's freedom of movement, for example with ropes, handcuffs
              or other devices
            </p>
            <p>
              <span className="size-3 inline-block bg-red-500 rounded-full "></span>{" "}
              Discipline : Agreed-upon rules and punishments for the dominant
              partner who uses them to control obedience over the submissive
              partner
            </p>
            <p>
              <span className="size-3 inline-block bg-red-500 rounded-full"></span>{" "}
              Dominance : Showing superiority over a partner, whether during sex
              or outside the bedroom
            </p>
            <p>
              <span className="size-3 inline-block bg-red-500 rounded-full"></span>{" "}
              Subordination : Listening to the commands and instructions of the
              dominant partner
            </p>
            <p>
              <span className="size-3 inline-block bg-red-500 rounded-full"></span>{" "}
              Sadism and masochism (or sadomasochism ): The pleasure a partner
              may feel from inflicting pain ( sadism ) or receiving pain
              (masochism), whether physical or emotional
            </p>
          </div>
        </div>
      </SectionCard>
    </article>
  );
};

export default SectionArticle;
