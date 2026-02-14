import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black/95">
            <div className="p-4">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-zinc-900 border border-zinc-800 shadow-xl",
                            headerTitle: "text-white",
                            headerSubtitle: "text-zinc-400",
                            socialButtonsBlockButton: "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700",
                            formFieldLabel: "text-zinc-400",
                            formFieldInput: "bg-zinc-950 border-zinc-800 text-white",
                            footerActionLink: "text-primary hover:text-primary-dim",
                            identityPreviewText: "text-zinc-400",
                            formButtonPrimary: "bg-white text-black hover:bg-zinc-200"
                        }
                    }}
                />
            </div>
        </div>
    );
}
