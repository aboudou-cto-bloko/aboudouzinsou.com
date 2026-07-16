import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/dashboard/:path*",
};

export function proxy(req: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;

  // Si aucun mot de passe n'est configuré, on bloque par défaut plutôt que
  // d'exposer le dashboard publiquement par erreur de configuration.
  if (!password) {
    return new NextResponse("Dashboard non configuré (DASHBOARD_PASSWORD manquant).", {
      status: 503,
    });
  }

  const auth = req.headers.get("authorization");
  if (auth) {
    const [, encoded] = auth.split(" ");
    const [, pass] = Buffer.from(encoded ?? "", "base64").toString().split(":");
    if (pass === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentification requise", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Dashboard"' },
  });
}
