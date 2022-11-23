export function Label({ children }) {
	return (
		<p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border bg-gray-300 w-max px-4 rounded">{children}</p>
	)
}