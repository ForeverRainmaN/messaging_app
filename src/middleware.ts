import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { URL } from "next/dist/compiled/@edge-runtime/primitives/url"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname

    const isAuth = await getToken({ req })
    const isLoginPage = pathname.startsWith("/login")

    const sensitiveRoutes = ["/dashboard"]

    const isAccesssingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (isLoginPage) {
      if (isAuth) return NextResponse.redirect(new URL("/dashboard", req.url))

      return NextResponse.next()
    }

    if (!isAuth && isAccesssingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
}
