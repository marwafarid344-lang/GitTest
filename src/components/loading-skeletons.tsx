import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'

export function FileCardSkeleton({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <Card className="bg-white/[0.02] border-white/10 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!isLoggedIn && (
          <div className="text-red-500 font-semibold mb-4">
            Unlogged users cannot see the drive data due to <Link href="/privacy" className="underline">policy of privacy</Link>
            <br>
            <Link href="/login" className="underline">Login From Here</Link>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="flex-1 h-8" />
          <Skeleton className="flex-1 h-8" />
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card className="bg-white/[0.02] border-white/10 text-center">
      <CardContent className="p-4" style={{ marginTop:'-34px',marginBottom:'-22px' }}>
        <Skeleton className="h-8 w-16 mx-auto mb-1" />
        <Skeleton className="h-4 w-20 mx-auto" />
      </CardContent>
    </Card>
  )
}
