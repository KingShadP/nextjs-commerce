import Grid from "components/grid";

export default function Loading() {
  return (
    <>
      <div className="mb-4 h-6" />
      <Grid className="grid-cols-2 lg:grid-cols-3">
        {Array(12)
          .fill(0)
          .map((_, index) => (
            <Grid.Item
              key={index}
              className="animate-pulse bg-[#0D0C0B] border border-white/5"
            />
          ))}
      </Grid>
    </>
  );
}
