import { Card, CardContent, Skeleton } from "@mui/material";

export default function FormSkeleton({ fields = 3 }) {
  return (
    <Card>
      <CardContent>
        {Array.from({ length: fields }).map((_, i) => (
          <Skeleton key={i} height={56} sx={{ mb: 2 }} />
        ))}
        <Skeleton height={42} />
      </CardContent>
    </Card>
  );
}
