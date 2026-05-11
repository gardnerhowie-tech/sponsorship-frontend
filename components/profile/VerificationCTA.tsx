type Props = {
  hasHostVerification: boolean;
};

export default function VerificationCTA({
  hasHostVerification,
}: Props) {

  if (hasHostVerification) {
    return null;
  }

  return (

    <section className="border border-black/10">

      <div className="p-10 flex flex-col gap-5">

        <p className="text-xs uppercase tracking-[0.2em] text-black/40">
          Verification
        </p>

        <div className="flex flex-col gap-3 max-w-2xl">

          <h2 className="text-4xl font-semibold tracking-tight text-black">
            Unlock Full Trust Classification
          </h2>

          <p className="text-black/50 leading-relaxed">
            Host-submitted verification data enables deeper audience responsiveness analysis,
            sponsor outcome validation, and verified trust classification.
          </p>

        </div>

        <a
          href="https://tally.so/r/ODBP5R"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit mt-2 border border-black/10 px-5 py-3 text-sm text-black/55 hover:border-black/25 hover:text-black transition-all inline-flex items-center"
        >
          Host? Submit Survey Now
        </a>

      </div>

    </section>
  );
}