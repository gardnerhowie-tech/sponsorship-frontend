import Image from "next/image";

type Props = {
  podcastName: string;
  avatar: string;
  scoreType: string;
  lastUpdated: string;
};

export default function PodcastHeader({
  podcastName,
  avatar,
  scoreType,
  lastUpdated,
}: Props) {

  const timestamp = Date.parse(lastUpdated);

  const now = Date.now();

  const diffDays =
    (now - timestamp) /
    (1000 * 60 * 60 * 24);

  const isFresh =
    !Number.isNaN(diffDays) &&
    diffDays <= 30;

  return (
    <section className="border border-black/10 bg-transparent p-8">

      <div className="flex items-center gap-6">

        <div className="w-28 h-28 rounded-full overflow-hidden border border-black/10 bg-black/5 flex-shrink-0 relative">

          <Image
            src={avatar}
            alt={podcastName}
            fill
            className="object-cover"
          />

        </div>

        <div className="flex flex-col gap-2">

          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Podcast Intelligence Profile
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-black">
            {podcastName}
          </h1>

          <div className="flex items-center gap-3 pt-3">

            <span className="border border-black/10 px-3 py-1 text-xs text-black/55">
              {scoreType}
            </span>

            <div className="flex items-center gap-2 text-xs text-black/40">

              <div
                className={`w-2 h-2 rounded-full ${
                  isFresh
                    ? "bg-green-500"
                    : "bg-amber-500"
                }`}
              />

              <span>
                {isFresh
                  ? "Up to date"
                  : "Refresh recommended"}
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}