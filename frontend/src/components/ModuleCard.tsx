import Link from "next/link";

export default function ModuleCard({
  title,
  desc,
  icon,
  color,
  href,
}: any) {
  return (
    <Link href={href}>
      <div
        className={`${color} rounded-3xl p-6 shadow-md hover:scale-105 transition cursor-pointer`}
      >
        <div className="flex justify-center mb-4">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-center">
          {title}
        </h2>

        <p className="text-center mt-3 text-gray-700">
          {desc}
        </p>
      </div>
    </Link>
  );
}