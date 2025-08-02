import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-4">
      {/* SmritiAI Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-lime-400 drop-shadow-lg text-center">
        SmritiAI
      </h1>

      {/* Custom Card */}
      <div
        className="
          relative
          bg-gradient-to-br
          from-lime-700
          via-lime-600
          to-lime-500
          p-8
          w-full
          max-w-md
          rounded-tl-[80px]
          rounded-tr-md
          rounded-br-md
          rounded-bl-md
          shadow-2xl
        "
      >
        <SignUp
          signInUrl="/sign-in"
          appearance={{
            elements: {
              card: "bg-transparent shadow-none",
              headerTitle: "text-black text-xl font-semibold mb-2",
              headerSubtitle: "text-zinc-800 mb-4",
              formButtonPrimary:
                "bg-black hover:bg-zinc-900 text-lime-400 font-semibold rounded-full w-full mt-4",
              formFieldInput:
                "bg-lime-200 text-black placeholder-black rounded-md",
              footerActionText: "text-zinc-800",
              footerActionLink: "text-black hover:underline",
            },
            variables: {
              colorPrimary: "#ADFF2F",
            },
          }}
        />
      </div>
    </main>
  );
}



