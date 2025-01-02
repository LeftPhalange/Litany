import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { CgMenu } from "react-icons/cg";

export default function NavigationBar({ navigationPaneOpened, setNavigationPaneOpened }: { navigationPaneOpened: boolean, setNavigationPaneOpened: Dispatch<SetStateAction<boolean>> }) {
    return (
        <nav className="flex flex-row py-4 px-8 space-x-4 md:space-x-0 justify-left border-b border-1 border-neutral-700">
            <button onClick={() => setNavigationPaneOpened(!navigationPaneOpened)} className={`block md:hidden p-2 ${ navigationPaneOpened ? "bg-neutral-800" : "hover:bg-neutral-800" } rounded-full`}>
                <CgMenu size={20} />
            </button>
            <Image src={"/assets/logo.svg"} alt={"Litany"} width={32} height={32} />
        </nav>
    );
}