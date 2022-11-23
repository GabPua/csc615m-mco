import { Label } from "./Label"

export function Tape({ data, index }) {
	return (
		<div className="bg-orange-100 text-center grid place-items-center relative rounded">
			<Label>Tape</Label>
			<div className="text-xl space-x-1">
				{
					data.split('').map((d, i) => <span className={i == index ? 'has-caret' : ''} key={i}>{d}</span>)
				}
			</div>
		</div>
	)
}
