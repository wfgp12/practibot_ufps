interface StepperProps {
  current: number
  steps: string[]
}

export const Stepper = ({ current, steps }: StepperProps) => {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => {
        const active = index === current
        const completed = index < current

        return (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full 
              ${completed ? "bg-green-500 text-white" :
                active ? "bg-red-600 text-white" :
                  "bg-gray-300 text-gray-600"}`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-gray-600">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
