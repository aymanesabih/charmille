import Link from "next/link"
import { Card } from "@/components/ui/card"

export  default function Espace() {
  return (
    (<div
      className="flex h-screen w-full items-center justify-center   bg-no-repeat bg-cover">
      <Card
        className="mx-4 w-full max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:border-gray-800">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500 dark:text-gray-400">Choisir votre option de connexion </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center">
            <Link
              className="inline-flex my-[3px] h-20 w-20 items-center justify-center rounded-full bg-[url(/espace-parent.svg)] bg-cover bg-center shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-[url(/placeholder.svg)] dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="/espace/login">
              
              <span className="sr-only">Student Login</span>
            </Link>
            <h1 className="font-bold">Parent</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link
              className="inline-flex my-[3px] h-20 w-20 items-center justify-center rounded-full bg-[url(/espace-eleve.svg)] bg-cover bg-center border border-gray-200 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-[url(/placeholder.svg)] dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 dark:border-gray-800"
              href="/espace/login">
              <span className="sr-only">Parent Login</span>
            </Link>
            <h1 className="font-bold">Elève</h1>
          </div>
        </div>
      </Card>
    </div>)
  );
}
