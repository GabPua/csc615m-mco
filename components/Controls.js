import { Label } from "./Label"

export function Controls({ disabled1, disabled2, branchLength, onBranchChange, onTypeChange }) {
	return (
		<div className="relative bg-green-100 p-4 rounded grid gap-y-2">
			<Label>Controls</Label>
			<div>
				<label htmlFor="type">Machine Type</label>
				<select name="type" id="type" disabled={disabled1} onChange={onTypeChange}>
					<option value="twa">Two-Way Accepter</option>
					<option value="multi-queue">Two-Way Free Stack/Tape, Multi-Queue Variant</option>
					<option value="two-stack">One-Way, Free Stack/Tape, Two-stack Variant</option>
					<option value="tm">Two-Way, Counter, Single Tape Variant</option>
				</select>
			</div>
			<div>
				<label htmlFor="branch">Branch</label>
				<select name="branchIndex" id="branch" disabled={disabled2} onChange={onBranchChange}>
					{Array.from({ length: branchLength }).map((_, i) => <option value={i}>Branch {i + 1}</option>)}
				</select>
			</div>
			<div>
				<label htmlFor="input">Initial Input</label>
				<input type="text" id="input" name="input" disabled={disabled1} />
			</div>
			<div className="grid gap-y-1 mt-4">
				<button name="command" value="init" disabled={disabled1}>Initialize</button>
				<button name="command" value="run" disabled={disabled2}>Run</button>
				<button name="command" value="step" disabled={disabled2}>Step</button>
				<button name="command" value="reset">Reset</button>
			</div>
		</div>
	)
}
