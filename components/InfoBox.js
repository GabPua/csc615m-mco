import { Label } from './Label'

export function InfoBox({ text, data }) {
  return (
    <div className="relative text-center pt-6 pb-3 border bg-green-100 rounded">
      <Label>{text}</Label>
      <p className="text-center text-lg">{data}</p>
    </div>
  )
}