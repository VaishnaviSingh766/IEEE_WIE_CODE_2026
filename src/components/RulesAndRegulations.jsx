import Background from "../utils/Background";

const rules = [
  "Once a team's abstract is selected, the team must complete the participation process within the specified time. Failure to complete it may result in disqualification.",
  "The hackathon will run for the duration announced by the organisers. Participants must be present and ready at the reporting time.",
  "Teams must consist of 2 members, 3 members, or 4 members, as permitted by the event guidelines.",
  "Every team member must provide accurate personal and contact details during registration.",
  "Each team must submit an abstract in the format specified on the registration page.",
  "A team may submit solutions to multiple problem statements; however, only the best solution will be considered if selected.",
  "A mentor will be allotted to each team for guidance during the event.",
  "Teams must present their ideas at the announced checkpoints for progress evaluation.",
  "Teams must disclose their team name and team leader's name during registration. Hardware kits will not be provided unless announced separately.",
  "There may be a limit on entries for each problem statement. Entries will be considered for screening in the order received.",
  "Internet facilities may be provided for the duration of the event, subject to venue availability.",
  "Only a reasonable amount of pre-cooked code is permitted. Teams must be able to explain and demonstrate their own work.",
  "Clearly specify the email IDs and mobile numbers of all team members.",
  "Certificates of participation will be provided according to the event guidelines.",
  "All official communication will be sent to the primary email submitted during registration.",
];

export default function RulesAndRegulations() {
  return (
    <section
      id="rules"
      className="relative overflow-hidden bg-black px-2 py-14 text-white sm:px-4 md:py-20"
    >
      <Background
        density={1.2}
        colors={["#ffffff", "#ff4db8", "#e6007e"]}
        className="opacity-60"
      />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(194,24,145,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(194,24,145,0.07)_1px,transparent_1px)] [background-size:10px_10px]" />
      <div className="pointer-events-none absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-[#c21891]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-10 text-center sm:mb-12">
          <h2 className="font-heading text-4xl font-black tracking-normal sm:text-6xl">
            RULES &amp; REGULATIONS
          </h2>
        </header>

        <div className="mx-auto max-w-[1080px]">
          {rules.map((rule) => (
            <article
              key={rule}
              className="group flex items-start gap-3 py-0.5 sm:gap-4 sm:py-1"
            >
              <span className="font-paragraph w-6 shrink-0 text-right text-lg leading-7 text-[#c21891] transition-colors sm:leading-8">
                ➢
              </span>
              <p className="font-paragraph flex-1 !text-base leading-7 text-white/85 sm:!text-lg sm:leading-8">
                <span>
                  {rule}
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
