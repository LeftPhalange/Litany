export default function PaneNode({ title, color, selected, onClick }: { title: string, color: string, selected: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`min-w-72 py-2 px-8 ${selected && color && "border-l-4"} ${color} text-left transition-none sm:transition-all hover:bg-zinc-800 ${selected ? "bg-zinc-800" : ""} `}>
            <span className={`text-sm ${selected ? "font-semibold" : "font-regular"}`}>{title}</span>
        </button>
    )
}