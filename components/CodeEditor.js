import { Label } from "./Label"

export function CodeEditor({ disabled1, disabled2 }) {
	return (
		<div className="relative">
			<Label>Program</Label>
			<textarea className="border border-gray-500 resize-none w-full p-2 font-mono h-full" name="program">
			</textarea>
		</div>
	)
}