import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
};

export function WorkingHoursField({ control, register, watch, errors }: Props) {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  return (
    <div>
      <div className="space-y-4">
        <h4 className="my-4 font-bold text-white/50 text-base underline mb-3">
          Opening Hours
        </h4>
        {days.map((day) => {
          const enabled = watch(`workingHours.${day}.enabled`);
          return (
            <div key={day} className="grid grid-cols-4 gap-4 items-center">
              <label className="capitalize">{day}</label>
              <input
                type="checkbox"
                {...register(`workingHours.${day}.enabled`)}
              />
              <input
                type="time"
                {...register(`workingHours.${day}.start`)}
                disabled={!enabled}
                className="border px-2 py-1"
              />
              <input
                type="time"
                {...register(`workingHours.${day}.end`)}
                disabled={!enabled}
                className="border px-2 py-1"
              />
              {/* {errors.workingHours?.[day]?.end && (
                <p className="col-span-4 text-red-500 text-sm">
                  {errors.workingHours[day]?.end.message}
                </p>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
