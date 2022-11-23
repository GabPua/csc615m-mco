import { Label } from './Label'

export function Memory({ type, data }) {
	return (
		<div className="relative py-4 pt-6 bg-green-100 rounded px-4">
			<Label>{type}</Label>
			<div className="max-h-32 overflow-auto">
				<table className="w-full border border-gray-600 max-w-[300px] mx-auto bg-white">
					<tbody>
						{
							data.map((d, i) => (
								<tr key={i}>
									<td className="border border-gray-600 px-1 w-24">
										<p>{d.name}</p>
									</td>
									<td className="border border-gray-600 px-1">
										<p>{d.data}</p>
									</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		</div>
	)
}