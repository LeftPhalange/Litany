import Image from "next/image";
import Link from "next/link";

export default function CheckEmailPage() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <div className="flex flex-col space-y-4 p-12 bg-neutral-900 border border-neutral-700 rounded-xl max-w-sm text-center">
                <div className="flex justify-center">
                    <Image src="/assets/logo.svg" alt="Litany logo" width={32} height={32} />
                </div>
                <span className="text-lg font-bold">Check your email</span>
                <span className="text-sm text-neutral-400">
                    We sent a confirmation link to your address. Click the link in the email to activate your account.
                </span>
                <Link href="/auth" className="text-sm text-sky-400 hover:text-sky-300 underline">
                    Back to sign in
                </Link>
            </div>
        </div>
    );
}
