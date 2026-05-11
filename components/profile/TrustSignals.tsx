type TrustSignal = {
  name: string;
  score?: number;
  description: string;
  status: "active" | "pending";
};

type Props = {
  signals: TrustSignal[];
};

export default function TrustSignals({
  signals,
}: Props) {

  return (

    <section className="border border-black/10">

      <div className="p-10">

        <div className="flex items-center justify-between mb-8">

          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Trust Signals
          </p>

          <p className="text-xs uppercase tracking-[0.2em] text-black/25">
            Signal-level analysis
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {signals.map((signal) => (

            <div
              key={signal.name}
              className="border border-black/10 p-6 flex flex-col justify-between min-h-[260px]"
            >

              <div className="flex flex-col gap-5">

                <div className="flex items-center justify-between">

                  <span
                    className={`text-[11px] uppercase tracking-[0.18em] ${
                      signal.status === "active"
                        ? "text-black/50"
                        : "text-black/25"
                    }`}
                  >
                    {signal.status}
                  </span>

                  {signal.score !== undefined ? (

                    <span className="text-5xl font-semibold tracking-tight text-black">
                      {signal.score}
                    </span>

                  ) : (

                    <span className="text-4xl text-black/20">
                      —
                    </span>

                  )}

                </div>

                <div className="flex flex-col gap-3">

                  <h3 className="text-2xl font-medium tracking-tight text-black leading-tight">
                    {signal.name}
                  </h3>

                  <p className="text-black/50 leading-relaxed text-sm">
                    {signal.description}
                  </p>

                  {signal.name === "Host Verification" &&
                    signal.status === "pending" && (

                    <a
                      href="https://tally.so/r/ODBP5R"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 border border-black/10 px-4 py-2 text-sm text-black/55 hover:border-black/25 hover:text-black transition-all inline-flex w-fit"
                    >
                      Host? Submit Host Survey
                    </a>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}