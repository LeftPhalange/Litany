export default function Label ({ title, color }: { title: string, color: string }) {
    return (
        <span className={`${color} text-xs font-bold select-none w-fit px-2 py-0.5 rounded-full uppercase`}>{title}</span>
    )
}