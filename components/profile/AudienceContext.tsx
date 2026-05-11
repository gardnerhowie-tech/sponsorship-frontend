type Props = {
  subscribers: string;
  avgViews: string;
  medianViews: string;
  engagementRate: string;
  videoCount: string;
};

export default function AudienceContext({
  subscribers,
  avgViews,
  medianViews,
  engagementRate,
  videoCount,
}: Props) {

  return (
    <section className="border-t border-black/10 pt-6">

      <p className="text-xs uppercase tracking-[0.2em] text-black/40 mb-6">
        Audience Context
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

        <div>

          <p className="text-xs uppercase tracking-[0.15em] text-black/40">
            Subscribers
          </p>

          <p className="text-4xl font-semibold tracking-tight pt-3 text-black">
            {subscribers}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-[0.15em] text-black/40">
            Avg Views
          </p>

          <p className="text-4xl font-semibold tracking-tight pt-3 text-black">
            {avgViews}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-[0.15em] text-black/40">
            Median Views
          </p>

          <p className="text-4xl font-semibold tracking-tight pt-3 text-black">
            {medianViews}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-[0.15em] text-black/40">
            Engagement
          </p>

          <p className="text-4xl font-semibold tracking-tight pt-3 text-black">
            {engagementRate}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-[0.15em] text-black/40">
            Videos
          </p>

          <p className="text-4xl font-semibold tracking-tight pt-3 text-black">
            {videoCount}
          </p>

        </div>

      </div>

    </section>
  );
}